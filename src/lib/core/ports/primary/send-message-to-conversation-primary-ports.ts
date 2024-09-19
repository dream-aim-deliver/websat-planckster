/* eslint-disable @typescript-eslint/no-explicit-any */
import { type Signal } from "../../entity/signals";
import {
  type TSendMessageToConversationErrorResponse,
  type TSendMessageToConversationProgressResponse,
  type TSendMessageToConversationRequest,
  type TSendMessageToConversationSuccessResponse,
} from "../../usecase-models/send-message-to-conversation-usecase-models";
import { type TSendMessageToConversationViewModel } from "../../view-models/send-message-to-conversation-view-model";

export interface SendMessageToConversationInputPort {
  execute(request: TSendMessageToConversationRequest): Promise<void>;
}

export interface SendMessageToConversationOutputPort {
  response: Signal<TSendMessageToConversationViewModel>;
  presentProgress(usecaseProgressResponse: TSendMessageToConversationProgressResponse): Promise<void>;
  presentSuccess(usecaseSuccessResponse: TSendMessageToConversationSuccessResponse): Promise<void>;
  presentError(usecaseErrorResponse: TSendMessageToConversationErrorResponse): Promise<void>;
}
