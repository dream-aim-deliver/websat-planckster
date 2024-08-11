import { TSignal } from "~/lib/core/entity/signals";
import { ListSourceDataOutputPort } from "~/lib/core/ports/primary/list-source-data-primary-ports";
import { TListSourceDataSuccessResponse, TListSourceDataErrorResponse } from "~/lib/core/usecase-models/list-source-data-view-models";
import { TListSourceDataViewModel } from "~/lib/core/view-models/list-source-data-view-models";

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