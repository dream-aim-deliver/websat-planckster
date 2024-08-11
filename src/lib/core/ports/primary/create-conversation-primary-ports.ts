import { TCreateConversationErrorResponse, TCreateConversationRequest, TCreateConversationSuccessResponse } from "../../usecase-models/create-conversation-usecase-models";

export interface CreateConversationInputPort {
    presenter: CreateConversationOutputPort<any>;
    execute(request: TCreateConversationRequest): Promise<void>;
}

export interface CreateConversationOutputPort<TResponse> {
    response: TResponse;
    presentSuccess(response: TCreateConversationSuccessResponse): void;
    presentError(response: TCreateConversationErrorResponse): void;
}