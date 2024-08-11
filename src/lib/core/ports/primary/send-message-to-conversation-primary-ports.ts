import { TSendMessageToConversationErrorResponse, TSendMessageToConversationProgressResponse, TSendMessageToConversationRequest, TSendMessageToConversationSuccessResponse } from "../../usecase-models/send-message-to-conversation-usecase-models";

export interface SendMessageToConversationInputPort {
    presenter: SendMessageToConversationOutputPort<any>;
    execute(request: TSendMessageToConversationRequest): Promise<void>;
}

export interface SendMessageToConversationOutputPort<TResponse> {
    response: TResponse;
    presentProgress(response: TSendMessageToConversationProgressResponse): void;
    presentSuccess(response: TSendMessageToConversationSuccessResponse): void;
    presentError(response: TSendMessageToConversationErrorResponse): void;
}