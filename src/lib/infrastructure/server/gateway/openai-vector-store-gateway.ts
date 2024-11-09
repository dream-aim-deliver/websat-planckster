import { inject, injectable } from "inversify";
import { Logger } from "pino";
import { TCreateVectorStoreDTO, TGetVectorStoreDTO, TDeleteVectorStoreDTO } from "~/lib/core/dto/vector-store-dto";
import { RemoteFile } from "~/lib/core/entity/file";
import VectorStoreOutputPort from "~/lib/core/ports/secondary/vector-store-output-port";
import { GATEWAYS, OPENAI, UTILS } from "../config/ioc/server-ioc-symbols";
import OpenAI from "openai";
import type SourceDataGatewayOutputPort from "~/lib/core/ports/secondary/source-data-gateway-output-port";
import type AuthGatewayOutputPort from "~/lib/core/ports/secondary/auth-gateway-output-port";
import { generateOpenAIVectorStoreName, OPENAI_VECTOR_STORE_SUPPORTED_FILE_FORMATS, uint8ArrayToBase64 } from "../config/openai/openai-utils";
import fs from "fs";

@injectable()
export default class OpenAIVectorStoreGateway implements VectorStoreOutputPort {
  private logger: Logger;
  constructor(
    @inject(UTILS.LOGGER_FACTORY) loggerFactory: (module: string) => Logger,
    @inject(OPENAI.OPENAI_CLIENT) private openai: OpenAI,
    @inject(GATEWAYS.KERNEL_SOURCE_DATA_GATEWAY) private KernelSourceDataGateway: SourceDataGatewayOutputPort,
    @inject(GATEWAYS.AUTH_GATEWAY) private AuthGateway: AuthGatewayOutputPort,
  ) {
    this.logger = loggerFactory("OpenAIVectorStoreGateway");
  }

  async uploadFilesToOpenAI(files: RemoteFile[]): Promise<
    | {
        status: "success";
        data: RemoteFile[];
      }
    | {
        status: "error";
        message: string;
        operation: string;
      }
  > {
    try {
      this.logger.info({ files }, "Uploading files to OpenAI");
      const uploadedFiles: RemoteFile[] = [];

      for (const file of files) {
        // 1. Download file from Kernel
        const downloadDTO = await this.KernelSourceDataGateway.download(file);

        if (!downloadDTO.success) {
          this.logger.error({ file }, "Failed to download file from Kernel");
          return {
            status: "error",
            message: "Failed to download file from Kernel",
            operation: "openai:upload-files",
          };
        }

        const localFile = downloadDTO.data;

        // 2. Upload file to OpenAI
        const openaiFile = await this.openai.files.create({
          file: fs.createReadStream(localFile.relativePath),
          purpose: "assistants",
        });

        const fileExtension = `.${localFile.relativePath.split(".").pop()}`;
        this.logger.info({ fileExtension }, `DEBUG: File extension for ${localFile.relativePath}`);

        let remoteFile: RemoteFile;

        if (fileExtension && OPENAI_VECTOR_STORE_SUPPORTED_FILE_FORMATS.includes(fileExtension)) {
          remoteFile = {
            id: openaiFile.id,
            type: "remote",
            provider: "openai#vector-store",
            name: file.name,
            relativePath: file.relativePath,
            createdAt: `${new Date().toISOString()}`,
          };
        } else {
          remoteFile = {
            id: openaiFile.id,
            type: "remote",
            provider: "openai#non-vector-store",
            name: file.name,
            relativePath: file.relativePath,
            createdAt: `${new Date().toISOString()}`,
          };
        }

        uploadedFiles.push(remoteFile);
        fs.unlinkSync(localFile.relativePath);
      }

      // 3. Return uploaded files
      return {
        status: "success",
        data: uploadedFiles,
      };
    } catch (error) {
      this.logger.error({ error }, "Failed to upload files to OpenAI");
      return {
        status: "error",
        message: "Failed to upload files to OpenAI",
        operation: "openai:upload-files",
      };
    }
  }

  async createVectorStore(files: RemoteFile[]): Promise<TCreateVectorStoreDTO> {
    try {
      // 1. Upload files to OpenAI
      const uploadFilesDTO = await this.uploadFilesToOpenAI(files);

      if (uploadFilesDTO.status === "error") {
        this.logger.error({ uploadFilesDTO }, "Failed to upload files to OpenAI");
        return {
          success: false,
          data: {
            message: uploadFilesDTO.message,
            operation: uploadFilesDTO.operation,
          },
        };
      }

      const openaiFiles = uploadFilesDTO.data;

      this.logger.info({ openaiFiles }, "These files were uploaded to OpenAI");

      // Check that we have at least one file whose provider includes "openai"
      const openaiFilesCount = openaiFiles.filter((file) => file.provider.includes("openai")).length;
      if (openaiFilesCount === 0) {
        this.logger.error({ files }, "No files with provider 'openai' found");
        return {
          success: false,
          data: {
            message: "No files with provider:openai found",
            operation: "openai:create-vector-store",
          },
        };
      }

      // 2. Attach to the vector store only the files that are supported by OpenAI
      const supportedFiles = openaiFiles.filter((file) => file.provider === "openai#vector-store");

      this.logger.info({ filesWithOpenAIProvider: supportedFiles }, "DEBUG: Files with provider 'openai'");

      // 3. Create vector store
      const vectorStoreName = generateOpenAIVectorStoreName();
      const openaiVectorStore = await this.openai.beta.vectorStores.create({
        name: vectorStoreName,
        file_ids: supportedFiles.map((file) => file.id),
      });

      // 4. Return vector store ID and files that aren't supported by OpenAI's vector stores
      const openaiVectorStoreID = openaiVectorStore.id;
      const unsupportedFiles = openaiFiles.filter((file) => file.provider === "openai#non-vector-store");

      return {
        success: true,
        data: {
          provider: "openai",
          id: openaiVectorStoreID,
          unsupportedFiles: unsupportedFiles,
        },
      };
    } catch (error) {
      this.logger.error({ error }, `Failed to create vector store`);
      return {
        success: false,
        data: {
          message: "Failed to create vector store",
          operation: "openai:create-vector-store",
        },
      };
    }
  }

  async getVectorStore(researchContextExternalID: string): Promise<TGetVectorStoreDTO> {
    const vectorStoreName = researchContextExternalID;
    let openaiVectorStoreID: string;
    try {
      const openaiVectorStore = await this.openai.beta.vectorStores.retrieve(vectorStoreName);
      openaiVectorStoreID = openaiVectorStore.id;
      let vectorStoreStatus: "created" | "processing" | "available" | "error" = "created";
      switch (openaiVectorStore.status) {
        case "completed":
          vectorStoreStatus = "available";
          break;
        case "in_progress":
          vectorStoreStatus = "processing";
          break;
        case "expired":
          vectorStoreStatus = "error";
          break;
      }
      return {
        success: true,
        data: {
          status: vectorStoreStatus,
          provider: "openai",
          id: openaiVectorStoreID,
          message: `OpenAI status: ${openaiVectorStore.status}`,
          context: openaiVectorStore,
        },
      };
    } catch (error) {
      this.logger.error({ error }, `Failed to retrieve vector store: ${vectorStoreName} from OpenAI.`);
      return {
        success: false,
        data: {
          message: "Failed to retrieve vector store",
          operation: "openai:get-vector-store",
        },
      };
    }
  }

  async deleteVectorStore(researchContextExternalID: string): Promise<TDeleteVectorStoreDTO> {
    const getVectorStoreDTO = await this.getVectorStore(researchContextExternalID);
    if (!getVectorStoreDTO.success) {
      return {
        success: false,
        data: {
          message: "Failed to retrieve vector store",
          operation: "openai:delete-vector-store",
        },
      };
    }
    const vectorStoreID = getVectorStoreDTO.data.id;
    try {
      await this.openai.beta.vectorStores.del(vectorStoreID);
      return {
        success: true,
        data: {
          message: `Successfully deleted vector store: ${vectorStoreID} from OpenAI`,
        },
      };
    } catch (error) {
      this.logger.error({ error }, `Failed to delete vector store: ${vectorStoreID} from OpenAI`);
      return {
        success: false,
        data: {
          message: "Failed to delete vector store",
          operation: "openai:delete-vector-store",
        },
      };
    }
  }
}
