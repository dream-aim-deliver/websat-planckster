/* eslint-disable @typescript-eslint/no-explicit-any */
import { type TListConversationsErrorResponse, type TListConversationsRequest, type TListConversationsSuccessResponse } from "../../usecase-models/list-conversations-usecase-models";

export interface ListConversationsInputPort {
    presenter: ListConversationsOutputPort<any>;
    execute(request: TListConversationsRequest): Promise<void>;
}

export interface ListConversationsOutputPort<TResponse> {
    response: TResponse;
    presentSuccess(success: TListConversationsSuccessResponse): void;
    presentError(error: TListConversationsErrorResponse): void;
}