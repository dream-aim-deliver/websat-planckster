import { TSignal } from "~/lib/core/entity/signals";
import { ListResearchContextsOutputPort } from "~/lib/core/ports/primary/list-research-contexts-primary-ports";
import { TListResearchContextsSuccessResponse, TListResearchContextsErrorResponse } from "~/lib/core/usecase-models/list-research-contexts-usecase-models";
import { TListResearchContextsViewModel } from "~/lib/core/view-models/list-research-contexts-view-models";

export default class BrowserListResearchContextsPresenter implements ListResearchContextsOutputPort<TSignal<TListResearchContextsViewModel>> {
    response: TSignal<TListResearchContextsViewModel>;
    constructor(response: TSignal<TListResearchContextsViewModel>) {
        this.response = response;
    }
    presentSuccess(response: TListResearchContextsSuccessResponse): void {
        throw new Error("Method not implemented.");
    }
    presentError(response: TListResearchContextsErrorResponse): void {
        throw new Error("Method not implemented.");
    }
   
}