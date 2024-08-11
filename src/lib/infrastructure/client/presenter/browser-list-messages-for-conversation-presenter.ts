import { type TSignal } from "~/lib/core/entity/signals";
import { type ListMessagesForConversationOutputPort } from "~/lib/core/ports/primary/list-messages-for-conversation-primary-ports";
import { type TListMessagesForConversationSuccessResponse, type TListMessagesForConversationErrorResponse } from "~/lib/core/usecase-models/list-messages-for-conversation-usecase-models";
import { type TListMessagesForConversationViewModel } from "~/lib/core/view-models/list-messages-for-conversation-view-model";

export default class BrowserListMessagesForConversationPresenter implements ListMessagesForConversationOutputPort<TSignal<TListMessagesForConversationViewModel>> {
    response: TSignal<TListMessagesForConversationViewModel>;
    constructor(response: TSignal<TListMessagesForConversationViewModel>) {
        this.response = response;
    }
    presentSuccess(response: TListMessagesForConversationSuccessResponse): void {
        throw new Error("Method not implemented.");
    }
    presentError(response: TListMessagesForConversationErrorResponse): void {
        throw new Error("Method not implemented.");
    }
}