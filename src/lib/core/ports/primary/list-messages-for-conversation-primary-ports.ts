/* eslint-disable @typescript-eslint/no-explicit-any */
import { type TListMessagesForConversationErrorResponse, type TListMessagesForConversationSuccessResponse } from "../../usecase-models/list-messages-for-conversation-usecase-models";
import { type TListMessagesForConversationRequestViewModel } from "../../view-models/list-messages-for-conversation-view-model";

export interface ListMessagesForConversationInputPort {
    presenter: ListMessagesForConversationOutputPort<any>;
    execute(request: TListMessagesForConversationRequestViewModel): Promise<void>;
}

export interface ListMessagesForConversationOutputPort<TResponse> {
    response: TResponse;
    presentSuccess(success: TListMessagesForConversationSuccessResponse): void;
    presentError(error: TListMessagesForConversationErrorResponse): void;
}