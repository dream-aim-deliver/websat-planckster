/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type ILogObj, type Logger } from "tslog";
import { type Signal } from "~/lib/core/entity/signals";
import { type CaseStudyOutputPort } from "~/lib/core/ports/primary/case-study-primary-ports";
import { type TCaseStudyErrorResponse, type TCaseStudyProgressResponse, type TCaseStudySuccessResponse } from "~/lib/core/usecase-models/case-study-usecase-models";
import { type TCaseStudyViewModel } from "~/lib/core/view-models/case-study-view-model";

export default class BrowserCaseStudyPresenter implements CaseStudyOutputPort {
  logger: Logger<ILogObj>;
  response: Signal<TCaseStudyViewModel>;
  constructor(response: Signal<TCaseStudyViewModel>, loggerFactory: (module: string) => Logger<ILogObj>) {
    this.response = response;
    this.logger = loggerFactory("BrowserCaseStudyPresenter");
  }

  async presentProgress(usecaseProgressResponse: TCaseStudyProgressResponse): Promise<void> {
    this.logger.info({ usecaseProgressResponse }, `Case study progress`);
    this.response.update({
      status: "progress",
      message: usecaseProgressResponse.message,
      context: usecaseProgressResponse.context,
    });
  }

  async presentError(usecaseErrorResponse: TCaseStudyErrorResponse): Promise<void> {
    this.logger.error({ usecaseErrorResponse }, `Failed to execute case study.`);
    this.response.update({
      status: "error",
      message: usecaseErrorResponse.message,
      context: usecaseErrorResponse.context,
    });
  }

  async presentSuccess(usecaseSuccessResponse: TCaseStudySuccessResponse): Promise<void> {
    this.logger.info({ usecaseSuccessResponse }, `Successfully executed case study.`);
    this.response.update({
      status: "success",
      metadata: usecaseSuccessResponse.metadata,
      researchContext: usecaseSuccessResponse.researchContext,
      conversation: usecaseSuccessResponse.conversation,
    });
  }
}
