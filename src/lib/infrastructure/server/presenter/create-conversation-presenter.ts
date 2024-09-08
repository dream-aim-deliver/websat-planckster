/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type Logger } from "pino";
import { type Signal } from "~/lib/core/entity/signals";
import { type CreateConversationOutputPort } from "~/lib/core/ports/primary/create-conversation-primary-ports";
import { type TCreateConversationSuccessResponse, type TCreateConversationErrorResponse } from "~/lib/core/usecase-models/create-conversation-usecase-models";
import type { TCreateConversationViewModel } from "~/lib/core/view-models/create-conversation-view-model";

export default class CreateConversationPresenter implements CreateConversationOutputPort {
  logger: Logger;
  response: Signal<TCreateConversationViewModel>;
  constructor(response: Signal<TCreateConversationViewModel>, loggerFactory: (module: string) => Logger) {
    this.response = response;
    this.logger = loggerFactory("CreateConversationPresenter");
  }

  async presentSuccess(usecaseSuccessResponse: TCreateConversationSuccessResponse): Promise<void> {
    this.logger.debug({usecaseSuccessResponse}, `Successfully created conversation: ${usecaseSuccessResponse.conversation.title}`);
    this.response.update({
      status: "success",
      conversation: usecaseSuccessResponse.conversation,
    });
  }

  async presentError(usecaseErrorResponse: TCreateConversationErrorResponse): Promise<void> {
    this.logger.error({usecaseErrorResponse}, `Failed to create conversation: ${usecaseErrorResponse.message}`);
    this.response.update({
      status: "error",
      message: usecaseErrorResponse.message,
      context: usecaseErrorResponse.context,
    });
  }
}
