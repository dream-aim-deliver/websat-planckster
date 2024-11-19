import { inject, injectable } from "inversify";
import { Logger } from "pino";
import CaseStudyRepositoryOutputPort from "~/lib/core/ports/secondary/case-study-repository-output-port";
import { GATEWAYS, UTILS } from "../config/ioc/server-ioc-symbols";
import { GetCaseStudyMetadataDTO } from "~/lib/core/dto/case-study-repository-dto";
import type SourceDataGatewayOutputPort from "~/lib/core/ports/secondary/source-data-gateway-output-port";

@injectable()
export default class SDACaseStudyRepository implements CaseStudyRepositoryOutputPort {
  private logger: Logger;
  constructor(
    @inject(UTILS.LOGGER_FACTORY) private loggerFactory: (module: string) => Logger,
    @inject(GATEWAYS.KERNEL_SOURCE_DATA_GATEWAY) private kernelSourceDataGateway: SourceDataGatewayOutputPort,
  ) {
    this.logger = this.loggerFactory("SDACaseStudyRepository");
  }

  async getCaseStudyMetadata(caseStudyName: string, tracerID: string, jobID: string): Promise<GetCaseStudyMetadataDTO> {
    try {
      // TODO: concrete implementation of get case study metadata, after we standardize the scrapers
      return {
        success: false,
        data: {
          message: "Method not implemented yet.",
          operation: "sdaCaseStudy#getCaseStudyMetadata",
        },
      };
    } catch (error) {
      this.logger.error({ error }, "Error while attempting to get case study metadata.");
      return {
        success: false,
        data: {
          message: "Error while attempting to get case study metadata.",
          operation: "sdaCaseStudy#getCaseStudyMetadata",
        },
      };
    }
  }
}
