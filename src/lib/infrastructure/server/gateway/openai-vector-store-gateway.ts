import { inject, injectable } from "inversify";
import { Logger } from "pino";
import { TCreateVectorStoreDTO, TGetVectorStoreDTO, TDeleteVectorStoreDTO } from "~/lib/core/dto/vector-store-dto";
import { RemoteFile } from "~/lib/core/entity/file";
import VectorStoreOutputPort from "~/lib/core/ports/secondary/vector-store-output-port";
import { GATEWAYS, OPENAI, UTILS } from "../config/ioc/server-ioc-symbols";
import OpenAI from "openai";
import type SourceDataGatewayOutputPort from "~/lib/core/ports/secondary/source-data-gateway-output-port";
import type AuthGatewayOutputPort from "~/lib/core/ports/secondary/auth-gateway-output-port";
import { generateOpenAIVectorStoreName } from "../config/openai/openai-utils";
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

        const remoteFile: RemoteFile = {
          id: openaiFile.id,
          type: "remote",
          provider: "openai",
          name: file.name,
          relativePath: file.relativePath,
          createdAt: `${new Date().toISOString()}`,
        };

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

      this.logger.info({ openaiFiles }, "Uploaded files to OpenAI");

      // 2. Verify that files have provider == "openai"
      const filesWithOpenAIProvider = openaiFiles.filter((file) => file.provider === "openai");
      if (filesWithOpenAIProvider.length === 0) {
        this.logger.error({ files }, "No files with provider:openai found");
        return {
          success: false,
          data: {
            message: "No files with provider:openai found",
            operation: "openai:create-vector-store",
          },
        };
      }

      // 3. Create vector store with OpenAI
      const vectorStoreName = generateOpenAIVectorStoreName();
      const openaiVectorStore = await this.openai.beta.vectorStores.create({
        name: vectorStoreName,
        file_ids: filesWithOpenAIProvider.map((file) => file.id),
      });

      const openaiVectorStoreID = openaiVectorStore.id;
      return {
        success: true,
        data: {
          provider: "openai",
          id: openaiVectorStoreID,
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
