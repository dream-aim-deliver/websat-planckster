/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Signal } from "../../entity/signals";
import { type TListConversationsErrorResponse, type TListConversationsRequest, type TListConversationsSuccessResponse } from "../../usecase-models/list-conversations-usecase-models";
import type { TListConversationsViewModel } from "../../view-models/list-conversations-view-model";

export interface ListConversationsInputPort {
    execute(request: TListConversationsRequest): Promise<void>;
}

export interface ListConversationsOutputPort {
    response: Signal<TListConversationsViewModel>;
    presentSuccess(success: TListConversationsSuccessResponse): Promise<void>;
    presentError(error: TListConversationsErrorResponse): Promise<void>;
}