/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type ILogObj, type Logger } from "tslog";
import { type Signal } from "~/lib/core/entity/signals";
import { type SendMessageToConversationOutputPort } from "~/lib/core/ports/primary/send-message-to-conversation-primary-ports";
import { type TSendMessageToConversationSuccessResponse, type TSendMessageToConversationErrorResponse, type TSendMessageToConversationProgressResponse } from "~/lib/core/usecase-models/send-message-to-conversation-usecase-models";
import { type TSendMessageToConversationViewModel } from "~/lib/core/view-models/send-message-to-conversation-view-model";

export default class BrowserSendMessageToConversationPresenter implements SendMessageToConversationOutputPort {
  logger: Logger<ILogObj>;
  response: Signal<TSendMessageToConversationViewModel>;
  constructor(response: Signal<TSendMessageToConversationViewModel>, loggerFactory: (module: string) => Logger<ILogObj>) {
    this.response = response;
    this.logger = loggerFactory("BrowserSendMessageToConversationPresenter");
  }

  async presentProgress(usecaseProgressResponse: TSendMessageToConversationProgressResponse): Promise<void> {
    this.logger.info({ usecaseProgressResponse }, `Sending message to conversation progress: ${usecaseProgressResponse.progress}`);
    this.response.update({
      status: "progress",
      message: usecaseProgressResponse.message,
      progressReport: usecaseProgressResponse.progress,
    });
  }

  async presentError(usecaseErrorResponse: TSendMessageToConversationErrorResponse): Promise<void> {
    this.logger.error({ usecaseErrorResponse }, `Failed to send message to conversation: ${usecaseErrorResponse.message}`);
    this.response.update({
      status: "error",
      message: usecaseErrorResponse.message,
      context: usecaseErrorResponse.context,
    });
  }

  async presentSuccess(usecaseSuccessResponse: TSendMessageToConversationSuccessResponse): Promise<void> {
    this.logger.info({ usecaseSuccessResponse }, `Successfully sent message to conversation.`);
    this.response.update({
      status: "success",
      message: usecaseSuccessResponse.message,
      response: usecaseSuccessResponse.response,
    });
  }
}
