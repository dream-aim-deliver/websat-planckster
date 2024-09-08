/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type Logger } from "pino";
import { type Signal } from "~/lib/core/entity/signals";
import { type ListSourceDataOutputPort } from "~/lib/core/ports/primary/list-source-data-primary-ports";
import { type TListSourceDataErrorResponse, type TListSourceDataSuccessResponse } from "~/lib/core/usecase-models/list-source-data-usecase-models";
import { type TListSourceDataViewModel } from "~/lib/core/view-models/list-source-data-view-models";

export default class ListSourceDataPresenter implements ListSourceDataOutputPort {
  logger: Logger;
  response: Signal<TListSourceDataViewModel>;

  constructor(response: Signal<TListSourceDataViewModel>, loggerFactory: (module: string) => Logger) {
    this.response = response;
    this.logger = loggerFactory("ListSourceDataPresenter");
  }

  async presentSuccess(usecaseSuccessResponse: TListSourceDataSuccessResponse): Promise<void> {
    this.logger.debug({ usecaseSuccessResponse }, `Successfully retrieved ${usecaseSuccessResponse.sourceData.length} source data`);
    this.response.update({
      status: "success",
      sourceData: usecaseSuccessResponse.sourceData,
    });
  }

  async presentError(usecaseErrorResponse: TListSourceDataErrorResponse): Promise<void> {
    this.logger.error({ usecaseErrorResponse }, `Failed to retrieve source data: ${usecaseErrorResponse.message}`);
    this.response.update({
      status: "error",
      message: usecaseErrorResponse.message,
      context: usecaseErrorResponse.context,
    });
  }
}
