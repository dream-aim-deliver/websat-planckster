import { TListResearchContextDTO, TGetResearchContextDTO, TCreateResearchContextDTO } from "~/lib/core/dto/research-context-gateway-dto";
import ResearchContextGatewayOutputPort from "~/lib/core/ports/secondary/research-context-gateway-output-port";
import { RemoteFile } from "~/lib/core/entity/file";
import { inject, injectable } from "inversify";
import { Logger, ILogObj } from "tslog";
import { TRPC, UTILS } from "../config/ioc/client-ioc-symbols";
import type { TVanillaAPI } from "../trpc/vanilla-api";

@injectable()
export default class BrowserResearchContextGateway implements ResearchContextGatewayOutputPort {
  private logger: Logger<ILogObj>;
  constructor(
    @inject(TRPC.VANILLA_CLIENT) private api: TVanillaAPI,
    @inject(UTILS.LOGGER_FACTORY) private loggerFactory: (module: string) => Logger<ILogObj>,
  ) {
    this.logger = this.loggerFactory("BrowserSourceDataRepository");
  }
  async list(): Promise<TListResearchContextDTO> {
    try {
      const dto = await this.api.gateways.researchContext.list.query();
      return dto;
    } catch (error) {
      this.logger.error({ error }, "Could not invoke the server side feature to get client data for download");
      return {
        success: false,
        data: {
          operation: "researchContextRouter#list",
          message: "Could not invoke the server side feature to get client data for download",
        },
      };
    }
  }
  async get(researchContextID: string): Promise<TGetResearchContextDTO> {
    throw new Error("Method not implemented.");
  }

  async create(researchContextExternalID: string, researchContextTitle: string, researchContextDescription: string, sourceData: RemoteFile[]): Promise<TCreateResearchContextDTO> {
    try {
      const dto = this.api.gateways.researchContext.create.mutate({
        externalID: researchContextExternalID,
        title: researchContextTitle,
        description: researchContextDescription,
        sourceData: sourceData,
      });
      return dto;
    } catch (error) {
      this.logger.error({ error }, "Could not invoke the server side feature to get client data for download");
      return {
        success: false,
        data: {
          operation: "researchContextRouter#create",
          message: "Could not invoke the server side feature to get client data for download",
        },
      };
    }
  }
}
