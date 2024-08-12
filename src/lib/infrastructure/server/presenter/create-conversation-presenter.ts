/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type CreateConversationOutputPort } from "~/lib/core/ports/primary/create-conversation-primary-ports";
import { type TCreateConversationSuccessResponse, type TCreateConversationErrorResponse } from "~/lib/core/usecase-models/create-conversation-usecase-models";
import type { TCreateConversationViewModel } from "~/lib/core/view-models/create-conversation-view-model";

export default class CreateConversationPresenter implements CreateConversationOutputPort<TCreateConversationViewModel> {
    response: TCreateConversationViewModel;
    constructor(response: TCreateConversationViewModel) {
        this.response = response;
    }
    presentSuccess(success: TCreateConversationSuccessResponse): void {
        this.response = {
            status: "success",
            conversation: success.conversation
        };
    };

    presentError(error: TCreateConversationErrorResponse): void {
        this.response = {
            status: "error",
            message: error.message,
            context: error.context
        };
    }

}