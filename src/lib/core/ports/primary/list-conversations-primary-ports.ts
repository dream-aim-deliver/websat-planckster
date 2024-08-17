/* eslint-disable @typescript-eslint/no-explicit-any */
import { type TListConversationsResponse, type TListConversationsErrorResponse, type TListConversationsRequest, type TListConversationsSuccessResponse } from "../../usecase-models/list-conversations-usecase-models";
import { type TListConversationsErrorViewModel, type TListConversationsSuccessViewModel } from "../../view-models/list-conversations-view-model";

export interface ListConversationsInputPort {
    execute(request: TListConversationsRequest): Promise<TListConversationsResponse>;
}

export interface ListConversationsOutputPort {
    presentSuccess(success: TListConversationsSuccessResponse): TListConversationsSuccessViewModel;
    presentError(error: TListConversationsErrorResponse): TListConversationsErrorViewModel;
}