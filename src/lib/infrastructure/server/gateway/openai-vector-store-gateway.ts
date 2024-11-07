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

  async createVectorStore(files: RemoteFile[]): Promise<TCreateVectorStoreDTO> {
    // verify files have provider:openai
    const filesWithOpenAIProvider = files.filter((file) => file.provider === "openai");
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

    const vectorStoreName = generateOpenAIVectorStoreName();
    try {
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
      this.logger.error({ error }, `Failed to create vector store with name: ${vectorStoreName}`);
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
