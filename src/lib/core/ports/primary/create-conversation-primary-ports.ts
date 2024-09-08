/* eslint-disable @typescript-eslint/no-explicit-any */
import { type Signal } from "../../entity/signals";
import type { TCreateConversationErrorResponse, TCreateConversationRequest, TCreateConversationSuccessResponse } from "../../usecase-models/create-conversation-usecase-models";
import { type TCreateConversationViewModel } from "../../view-models/create-conversation-view-model";

export interface CreateConversationInputPort {
    execute(request: TCreateConversationRequest): Promise<void>;
}

export interface CreateConversationOutputPort {
    response: Signal<TCreateConversationViewModel>;
    presentSuccess(usecaseSuccessResponse: TCreateConversationSuccessResponse): Promise<void>;
    presentError(usecaseErrorResponse: TCreateConversationErrorResponse): Promise<void>;
}