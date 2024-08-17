/* eslint-disable @typescript-eslint/no-explicit-any */
import { type TCreateConversationResponse, type TCreateConversationErrorResponse, type TCreateConversationRequest, type TCreateConversationSuccessResponse } from "../../usecase-models/create-conversation-usecase-models";

export interface CreateConversationInputPort {
    execute(request: TCreateConversationRequest): Promise<TCreateConversationResponse>;
}

export interface CreateConversationOutputPort {
    presentSuccess(success: TCreateConversationSuccessResponse): void;
    presentError(error: TCreateConversationErrorResponse): void;
}