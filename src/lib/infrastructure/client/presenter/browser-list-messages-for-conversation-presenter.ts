/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type Signal } from "~/lib/core/entity/signals";
import { type ListMessagesForConversationOutputPort } from "~/lib/core/ports/primary/list-messages-for-conversation-primary-ports";
import { type TListMessagesForConversationSuccessResponse, type TListMessagesForConversationErrorResponse } from "~/lib/core/usecase-models/list-messages-for-conversation-usecase-models";
import { type TListMessagesForConversationViewModel } from "~/lib/core/view-models/list-messages-for-conversation-view-model";

export default class BrowserListMessagesForConversationPresenter implements ListMessagesForConversationOutputPort<Signal<TListMessagesForConversationViewModel>> {
    response: Signal<TListMessagesForConversationViewModel>;
    constructor(response: Signal<TListMessagesForConversationViewModel>) {
        this.response = response;
    }
    presentSuccess(success: TListMessagesForConversationSuccessResponse): void {
        this.response.update({
            status: "success",
            messages: success.messages
        });
    }

    presentError(error: TListMessagesForConversationErrorResponse): void {
        this.response.update({
            status: "error",
            message: error.message,
            context: error.context
        });
    }
}