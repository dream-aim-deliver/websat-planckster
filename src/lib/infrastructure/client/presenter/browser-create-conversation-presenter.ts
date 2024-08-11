import type { TSignal } from "~/lib/core/entity/signals";
import { type CreateConversationOutputPort } from "~/lib/core/ports/primary/create-conversation-primary-ports";
import { type TCreateConversationSuccessResponse, type TCreateConversationErrorResponse } from "~/lib/core/usecase-models/create-conversation-usecase-models";
import type { TCreateConversationViewModel } from "~/lib/core/view-models/create-conversation-view-model";

export default class BrowserCreateConversationPresenter implements CreateConversationOutputPort<TSignal<TCreateConversationViewModel>> {
    response: TSignal<TCreateConversationViewModel>;
    constructor(response: TSignal<TCreateConversationViewModel>) {
        this.response = response;
    }
    presentSuccess(response: TCreateConversationSuccessResponse): void {
        throw new Error("Method not implemented.");
    }
    presentError(response: TCreateConversationErrorResponse): void {
        throw new Error("Method not implemented.");
    }
}