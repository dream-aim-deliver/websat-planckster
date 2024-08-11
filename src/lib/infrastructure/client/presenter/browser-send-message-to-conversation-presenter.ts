import { type TSignal } from "~/lib/core/entity/signals";
import { type SendMessageToConversationOutputPort } from "~/lib/core/ports/primary/send-message-to-conversation-primary-ports";
import { type TSendMessageToConversationSuccessResponse, type TSendMessageToConversationErrorResponse, type TSendMessageToConversationProgressResponse } from "~/lib/core/usecase-models/send-message-to-conversation-usecase-models";
import { type TSendMessageToConversationViewModel } from "~/lib/core/view-models/send-message-to-conversation-view-model";

export default class BrowserSendMessageToConversationPresenter implements SendMessageToConversationOutputPort<TSignal<TSendMessageToConversationViewModel>> {
    response: TSignal<TSendMessageToConversationViewModel>;
    constructor(response: TSignal<TSendMessageToConversationViewModel>) {
        this.response = response;
    }
    presentProgress(progress: TSendMessageToConversationProgressResponse): void {
        this.response.update({
            status: "progress",
            message: progress.message,
            progressReport: progress.progress
        });
    }
    presentSuccess(success: TSendMessageToConversationSuccessResponse): void {
        this.response.update({
            status: "success",
            message: success.message,
            response: success.response
        });
    }
    presentError(error: TSendMessageToConversationErrorResponse): void {
        this.response.update({
            status: "error",
            message: error.message,
            context: error.context
        });
    }
}