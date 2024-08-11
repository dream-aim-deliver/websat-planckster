import { TSignal } from "~/lib/core/entity/signals";
import { SendMessageToConversationOutputPort } from "~/lib/core/ports/primary/send-message-to-conversation-primary-ports";
import { TSendMessageToConversationSuccessResponse, TSendMessageToConversationErrorResponse, TSendMessageToConversationProgressResponse } from "~/lib/core/usecase-models/send-message-to-conversation-usecase-models";
import { TSendMessageToConversationViewModel } from "~/lib/core/view-models/send-message-to-conversation-view-model";

export default class BrowserSendMessageToConversationPresenter implements SendMessageToConversationOutputPort<TSignal<TSendMessageToConversationViewModel>> {
    response: TSignal<TSendMessageToConversationViewModel>;
    constructor(response: TSignal<TSendMessageToConversationViewModel>) {
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