/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { TSignal } from "~/lib/core/entity/signals";
import { type CreateConversationOutputPort } from "~/lib/core/ports/primary/create-conversation-primary-ports";
import { type TCreateConversationSuccessResponse, type TCreateConversationErrorResponse } from "~/lib/core/usecase-models/create-conversation-usecase-models";
import type { TCreateConversationViewModel } from "~/lib/core/view-models/create-conversation-view-model";

export default class CreateConversationPresenter implements CreateConversationOutputPort<TSignal<TCreateConversationViewModel>> {
    response: TSignal<TCreateConversationViewModel>;
    constructor(response: TSignal<TCreateConversationViewModel>) {
        this.response = response;
    }
    presentSuccess(success: TCreateConversationSuccessResponse): void {
        this.response.update({
            status: "success",
            conversation: success.conversation
    });
}

    presentError(error: TCreateConversationErrorResponse): void {
        this.response.update({
            status: "error",
            message: error.message,
            context: error.context
        });
    }

}