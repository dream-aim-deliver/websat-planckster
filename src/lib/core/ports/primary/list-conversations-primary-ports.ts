/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Signal } from "../../entity/signals";
import type { TListConversationsErrorResponse, TListConversationsRequest, TListConversationsSuccessResponse } from "../../usecase-models/list-conversations-usecase-models";
import type { TListConversationsViewModel } from "../../view-models/list-conversations-view-model";

export interface ListConversationsInputPort {
    execute(request: TListConversationsRequest): Promise<void>;
}

export interface ListConversationsOutputPort {
    response: Signal<TListConversationsViewModel>;
    presentSuccess(usecaseSuccessResponse: TListConversationsSuccessResponse): Promise<void>;
    presentError(usecaseErrorResponse: TListConversationsErrorResponse): Promise<void>;
}