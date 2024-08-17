/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type ListSourceDataOutputPort } from "~/lib/core/ports/primary/list-source-data-primary-ports";
import { type TListSourceDataSuccessResponse, type TListSourceDataErrorResponse } from "~/lib/core/usecase-models/list-source-data-view-models";
import { type TListSourceDataErrorViewModel, type TListSourceDataSuccessViewModel } from "~/lib/core/view-models/list-source-data-view-models";

export default class ListSourceDataPresenter implements ListSourceDataOutputPort {
  presentSuccess(success: TListSourceDataSuccessResponse): TListSourceDataSuccessViewModel {
    return {
      status: "success",
      sourceData: success.sourceData,
    };
  }

  presentError(error: TListSourceDataErrorResponse): TListSourceDataErrorViewModel {
    return {
      status: "error",
      message: error.message,
      context: error.context,
    };
  }
}
