/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type Signal } from "~/lib/core/entity/signals";
import { type ListResearchContextsOutputPort } from "~/lib/core/ports/primary/list-research-contexts-primary-ports";
import { type TListResearchContextsSuccessResponse, type TListResearchContextsErrorResponse } from "~/lib/core/usecase-models/list-research-contexts-usecase-models";
import { type TListResearchContextsViewModel } from "~/lib/core/view-models/list-research-contexts-view-models";

export default class ListResearchContextsPresenter implements ListResearchContextsOutputPort {
    response: Signal<TListResearchContextsViewModel>;
    constructor(response: Signal<TListResearchContextsViewModel>) {
        this.response = response;
    }
    presentSuccess(success: TListResearchContextsSuccessResponse): void {
        this.response.update({
            status: "success",
            researchContexts: success.researchContexts
        });
    }
    presentError(response: TListResearchContextsErrorResponse): void {
        this.response.update({
            status: "error",
            message: response.message,
            context: response.context
        });
    }
}