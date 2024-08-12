/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type ListSourceDataOutputPort } from "~/lib/core/ports/primary/list-source-data-primary-ports";
import { type TListSourceDataSuccessResponse, type TListSourceDataErrorResponse } from "~/lib/core/usecase-models/list-source-data-view-models";
import { type TListSourceDataViewModel } from "~/lib/core/view-models/list-source-data-view-models";

export default class ListSourceDataPresenter implements ListSourceDataOutputPort<TListSourceDataViewModel> {
    response: TListSourceDataViewModel;
    constructor(response: TListSourceDataViewModel) {
        this.response = response;
    }

    presentSuccess(success: TListSourceDataSuccessResponse): void {
        this.response = {
            status: "success",
            sourceData: success.sourceData
        };
    }

    presentError(error: TListSourceDataErrorResponse): void {
        this.response = {
            status: "error",
            message: error.message,
            context: error.context
        };
    }
}
