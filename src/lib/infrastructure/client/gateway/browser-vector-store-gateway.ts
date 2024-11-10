import { inject, injectable } from "inversify";
import { ILogObj, Logger } from "tslog";
import { TCreateVectorStoreDTO, TGetVectorStoreDTO, TDeleteVectorStoreDTO } from "~/lib/core/dto/vector-store-dto";
import { RemoteFile } from "~/lib/core/entity/file";
import VectorStoreOutputPort from "~/lib/core/ports/secondary/vector-store-output-port";
import type { TVanillaAPI } from "../trpc/vanilla-api";
import { TRPC, UTILS } from "../config/ioc/client-ioc-symbols";

@injectable()
export default class BrowserVectorStoreGateway implements VectorStoreOutputPort {
  private logger: Logger<ILogObj>;
  constructor(
    @inject(TRPC.VANILLA_CLIENT) private api: TVanillaAPI,
    @inject(UTILS.LOGGER_FACTORY) private loggerFactory: (module: string) => Logger<ILogObj>,
  ) {
    this.logger = this.loggerFactory("BrowserVectorStoreGateway");
  }

  async createVectorStore(files: RemoteFile[]): Promise<TCreateVectorStoreDTO> {
    try {
      const dto = await this.api.gateways.vectorStore.create.mutate({
        files,
      });
      return dto;
    } catch (error) {
      this.logger.error({ error }, "Could not invoke the server side feature to create vector store");
      return {
        success: false,
        data: {
          operation: "vectorStoreGatewayRouter#create",
          message: "Could not invoke the server side feature to create vector store",
        },
      };
    }
  }
  getVectorStore(researchContextExternalID: string): Promise<TGetVectorStoreDTO> {
    throw new Error("Method not implemented.");
  }
  deleteVectorStore(researchContextExternalID: string): Promise<TDeleteVectorStoreDTO> {
    throw new Error("Method not implemented.");
  }
}
