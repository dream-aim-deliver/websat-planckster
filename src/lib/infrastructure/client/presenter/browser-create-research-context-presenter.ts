/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { TSignal } from "~/lib/core/entity/signals";
import type { CreateResearchContextOutputPort } from "~/lib/core/ports/primary/create-research-context-primary-ports";
import { type TCreateResearchContextErrorResponse, type TCreateResearchContextProgressResponse, type TCreateResearchContextSuccessResponse } from "~/lib/core/usecase-models/create-research-context-usecase-models";
import { TCreateResearchContextErrorViewModel, TCreateResearchContextSuccessViewModel, type TCreateResearchContextViewModel } from "~/lib/core/view-models/create-research-context-view-models";

export default class BrowserCreateResearchContextPresenter implements CreateResearchContextOutputPort<TSignal<TCreateResearchContextViewModel>> {
    response: TSignal<TCreateResearchContextViewModel>;
    constructor(
        response: TSignal<TCreateResearchContextViewModel>
    ) {
        this.response = response
    }
    presentProgress(progress: TCreateResearchContextProgressResponse): void {
        this.response.update({
            status: "progress",
            message: progress.message,
            context: progress.context
        })
    }

    presentSuccess(success: TCreateResearchContextSuccessResponse): void {
        this.response.update({
            status: "success",
            researchContext: success.researchContext
        })
    }
    presentError(error: TCreateResearchContextErrorResponse): void {
        this.response.update({
            status: "error",
            message: error.message,
            context: error.context
        })
    }
}