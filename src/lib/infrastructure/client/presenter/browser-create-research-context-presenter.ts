import type { TSignal } from "~/lib/core/entity/signals";
import type { CreateResearchContextOutputPort } from "~/lib/core/ports/primary/create-research-context-primary-ports";
import { TCreateResearchContextErrorResponse, TCreateResearchContextProgressResponse, TCreateResearchContextSuccessResponse } from "~/lib/core/usecase-models/create-research-context-usecase-models";
import { TCreateResearchContextViewModel } from "~/lib/core/view-models/create-research-context-view-models";

export default class BrowserCreateResearchContextPresenter implements CreateResearchContextOutputPort<TSignal<TCreateResearchContextViewModel>> {
    response: TSignal<TCreateResearchContextViewModel>;
    constructor(
        response: TSignal<TCreateResearchContextViewModel>
    ) {
        this.response = response
    }
    presentProgress(response: TCreateResearchContextProgressResponse): void {
        throw new Error("Method not implemented.");
    }
    presentSuccess(response: TCreateResearchContextSuccessResponse): void {
        throw new Error("Method not implemented.");
    }
    presentError(response: TCreateResearchContextErrorResponse): void {
        throw new Error("Method not implemented.");
    }
}