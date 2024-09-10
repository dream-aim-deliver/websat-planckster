/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type ILogObj, type Logger } from "tslog";
import { type Signal } from "~/lib/core/entity/signals";
import { type ListResearchContextsOutputPort } from "~/lib/core/ports/primary/list-research-contexts-primary-ports";
import { type TListResearchContextsSuccessResponse, type TListResearchContextsErrorResponse } from "~/lib/core/usecase-models/list-research-contexts-usecase-models";
import { type TListResearchContextsViewModel } from "~/lib/core/view-models/list-research-contexts-view-models";

export default class BrowserListResearchContextsPresenter implements ListResearchContextsOutputPort {
  logger: Logger<ILogObj>;
  response: Signal<TListResearchContextsViewModel>;
  constructor(response: Signal<TListResearchContextsViewModel>, loggerFactory: (module: string) => Logger<ILogObj>) {
    this.response = response;
    this.logger = loggerFactory("BrowserFileUploadPresenter");
  }
  async presentSuccess(usecaseSuccessResponse: TListResearchContextsSuccessResponse): Promise<void> {
    this.logger.debug({ usecaseSuccessResponse }, `Successfully retrieved research contexts`);
    this.response.update({
      status: "success",
      researchContexts: usecaseSuccessResponse.researchContexts,
    });
  }
  async presentError(usecaseErrorResponse: TListResearchContextsErrorResponse): Promise<void> {
    this.logger.error({ usecaseErrorResponse }, `Failed to retrieve research contexts: ${usecaseErrorResponse.message}`);
    this.response.update({
      status: "error",
      message: usecaseErrorResponse.message,
      context: usecaseErrorResponse.context,
    });
  }
}
