/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type TSignal } from "~/lib/core/entity/signals";
import { type ListSourceDataOutputPort } from "~/lib/core/ports/primary/list-source-data-primary-ports";
import { type TListSourceDataSuccessResponse, type TListSourceDataErrorResponse } from "~/lib/core/usecase-models/list-source-data-view-models";
import { type TListSourceDataViewModel } from "~/lib/core/view-models/list-source-data-view-models";

export default class ListSourceDataPresenter implements ListSourceDataOutputPort<TSignal<TListSourceDataViewModel>> {
    response: TSignal<TListSourceDataViewModel>;
    constructor(response: TSignal<TListSourceDataViewModel>) {
        this.response = response;
    }

    presentSuccess(success: TListSourceDataSuccessResponse): void {
        this.response.update({
            status: "success",
            sourceData: success.sourceData
        });
    }

    presentError(error: TListSourceDataErrorResponse): void {
        this.response.update({
            status: "error",
            message: error.message,
            context: error.context
        });
    }
}
