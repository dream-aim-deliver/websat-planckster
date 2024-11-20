import { inject, injectable } from "inversify";
import { ILogObj, Logger } from "tslog";
import CaseStudyRepositoryOutputPort from "~/lib/core/ports/secondary/case-study-repository-output-port";
import { TRPC, UTILS } from "../config/ioc/client-ioc-symbols";
import { type TVanillaAPI } from "../trpc/vanilla-api";
import { type GetCaseStudyMetadataDTO } from "~/lib/core/dto/case-study-repository-dto";

@injectable()
export default class BrowserSDACaseStudyRepository implements CaseStudyRepositoryOutputPort {
  private logger: Logger<ILogObj>;
  constructor(
    @inject(TRPC.VANILLA_CLIENT) private api: TVanillaAPI,
    @inject(UTILS.LOGGER_FACTORY) private loggerFactory: (module: string) => Logger<ILogObj>,
  ) {
    this.logger = this.loggerFactory("BrowserCaseStudyRepository");
  }

  async getCaseStudyMetadata(caseStudyName: string, tracerID: string, jobID: number): Promise<GetCaseStudyMetadataDTO> {
    try {
      const dto = await this.api.repositories.caseStudy.getMetadata.query({
        caseStudyName,
        tracerID,
        jobID,
      });
      this.logger.debug({ dto }, `Successfully retrieved CaseStudyMetadataDTO from the server.`);
      return dto;
    } catch (error) {
      this.logger.error({ error }, "Could not invoke the server side feature to get case study metadata");

      return {
        success: false,
        data: {
          operation: "caseStudyRouter#getCaseStudyMetadata",
          message: "Could not invoke the server side feature to get case study metadata",
        },
      };
    }
  }
}
