/* eslint-disable @typescript-eslint/no-explicit-any */
import { type Signal } from "../../entity/signals";
import { type TListMessagesForConversationRequest, type TListMessagesForConversationErrorResponse, type TListMessagesForConversationSuccessResponse } from "../../usecase-models/list-messages-for-conversation-usecase-models";
import { type TListMessagesForConversationViewModel } from "../../view-models/list-messages-for-conversation-view-model";

export interface ListMessagesForConversationInputPort {
    execute(request: TListMessagesForConversationRequest): Promise<void>;
}

export interface ListMessagesForConversationOutputPort {
    response: Signal<TListMessagesForConversationViewModel>;
    presentSuccess(usecaseSuccessResponse: TListMessagesForConversationSuccessResponse): Promise<void>;
    presentError(usecaseErrorResponse: TListMessagesForConversationErrorResponse): Promise<void>;
}