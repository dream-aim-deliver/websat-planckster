import { type TSignal } from "~/lib/core/entity/signals";
import { type ListSourceDataOutputPort } from "~/lib/core/ports/primary/list-source-data-primary-ports";
import { type TListSourceDataSuccessResponse, type TListSourceDataErrorResponse } from "~/lib/core/usecase-models/list-source-data-view-models";
import { type TListSourceDataViewModel } from "~/lib/core/view-models/list-source-data-view-models";

export default class BrowserListSourceDataPresenter implements ListSourceDataOutputPort<TSignal<TListSourceDataViewModel>> {
    response: TSignal<TListSourceDataViewModel>;
    constructor(response: TSignal<TListSourceDataViewModel>) {
        this.response = response;
    }
    presentSuccess(response: TListSourceDataSuccessResponse): void {
        throw new Error("Method not implemented.");
    }
    presentError(response: TListSourceDataErrorResponse): void {
        throw new Error("Method not implemented.");
    }
}