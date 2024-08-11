/* eslint-disable @typescript-eslint/no-explicit-any */
import { type TCreateConversationErrorResponse, type TCreateConversationRequest, type TCreateConversationSuccessResponse } from "../../usecase-models/create-conversation-usecase-models";

export interface CreateConversationInputPort {
    presenter: CreateConversationOutputPort<any>;
    execute(request: TCreateConversationRequest): Promise<void>;
}

export interface CreateConversationOutputPort<TResponse> {
    response: TResponse;
    presentSuccess(success: TCreateConversationSuccessResponse): void;
    presentError(error: TCreateConversationErrorResponse): void;
}