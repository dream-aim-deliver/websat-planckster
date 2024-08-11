import { TListMessagesForConversationErrorResponse, TListMessagesForConversationSuccessResponse } from "../../usecase-models/list-messages-for-conversation-usecase-models";
import { TListMessagesForConversationRequestViewModel } from "../../view-models/list-messages-for-conversation-view-model";

export interface ListMessagesForConversationInputPort {
    presenter: ListMessagesForConversationOutputPort<any>;
    execute(request: TListMessagesForConversationRequestViewModel): Promise<void>;
}

export interface ListMessagesForConversationOutputPort<TResponse> {
    response: TResponse;
    presentSuccess(response: TListMessagesForConversationSuccessResponse): void;
    presentError(response: TListMessagesForConversationErrorResponse): void;
}