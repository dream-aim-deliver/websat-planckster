import { type Logger } from "pino";
import { type Signal } from "~/lib/core/entity/signals";
import { type CreateResearchContextOutputPort } from "~/lib/core/ports/primary/create-research-context-primary-ports";
import { type TCreateResearchContextErrorResponse, type TCreateResearchContextProgressResponse, type TCreateResearchContextSuccessResponse } from "~/lib/core/usecase-models/create-research-context-usecase-models";
import { type TCreateResearchContextViewModel } from "~/lib/core/view-models/create-research-context-view-models";

export default class CreateResearchContextPresenter implements CreateResearchContextOutputPort<Signal<TCreateResearchContextViewModel>> {
  logger: Logger;
  response: Signal<TCreateResearchContextViewModel>;
  constructor(response: Signal<TCreateResearchContextViewModel>, loggerFactory: (module: string) => Logger) {
    this.response = response;
    this.logger = loggerFactory("CreateResearchContextPresenter");
  }

  async presentSuccess(usecaseSuccessResponse: TCreateResearchContextSuccessResponse): Promise<void> {
    this.logger.debug({ usecaseSuccessResponse }, `Successfully created research context: ${usecaseSuccessResponse.researchContext.title}`);
    this.response.update({
      status: "success",
      researchContext: usecaseSuccessResponse.researchContext,
    });
  }

  async presentProgress(usecaseProgressResponse: TCreateResearchContextProgressResponse): Promise<void> {
    this.logger.debug({ usecaseProgressResponse }, `Progress creating research context: ${usecaseProgressResponse.message}`);
    this.response.update({
      status: "progress",
      message: usecaseProgressResponse.message,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      context: usecaseProgressResponse.context,
    });
  }

  async presentError(usecaseErrorResponse: TCreateResearchContextErrorResponse): Promise<void> {
    this.logger.error({ usecaseErrorResponse }, `Failed to create research context: ${usecaseErrorResponse.message}`);
    this.response.update({
      status: "error",
      message: usecaseErrorResponse.message,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      context: usecaseErrorResponse.context,
    });
  }
}
