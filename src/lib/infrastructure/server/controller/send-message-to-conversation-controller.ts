import { type Signal } from "~/lib/core/entity/signals";
import { type SendMessageToConversationOutputPort } from "~/lib/core/ports/primary/send-message-to-conversation-primary-ports";
import { type TSendMessageToConversationSuccessResponse, type TSendMessageToConversationErrorResponse, type TSendMessageToConversationProgressResponse } from "~/lib/core/usecase-models/send-message-to-conversation-usecase-models";
import { type TSendMessageToConversationViewModel } from "~/lib/core/view-models/send-message-to-conversation-view-model";

export default class BrowserSendMessageToConversationPresenter implements SendMessageToConversationOutputPort<Signal<TSendMessageToConversationViewModel>> {
    response: Signal<TSendMessageToConversationViewModel>;
    constructor(response: Signal<TSendMessageToConversationViewModel>) {
        this.response = response;
    }
    presentProgress(response: TSendMessageToConversationProgressResponse): void {
        throw new Error("Method not implemented.");
    }
    presentSuccess(response: TSendMessageToConversationSuccessResponse): void {
        throw new Error("Method not implemented.");
    }
    presentError(response: TSendMessageToConversationErrorResponse): void {
        throw new Error("Method not implemented.");
    }
   
}