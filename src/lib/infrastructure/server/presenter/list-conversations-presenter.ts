/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { Logger } from "pino";
import type { Signal } from "~/lib/core/entity/signals";
import { type ListConversationsOutputPort } from "~/lib/core/ports/primary/list-conversations-primary-ports";
import { type TListConversationsSuccessResponse, type TListConversationsErrorResponse } from "~/lib/core/usecase-models/list-conversations-usecase-models";
import type { TListConversationsViewModel } from "~/lib/core/view-models/list-conversations-view-model";

export default class ListConversationsPresenter implements ListConversationsOutputPort {
  logger: Logger;
  response: Signal<TListConversationsViewModel>;
  constructor(response: Signal<TListConversationsViewModel>, loggerFactory: (module: string) => Logger) {
    this.response = response;
    this.logger = loggerFactory("ListConversationsPresenter");
  }
  async presentSuccess(usecaseResponse: TListConversationsSuccessResponse): Promise<void> {
    this.logger.debug({usecaseResponse},`Successfully retrieved ${usecaseResponse.conversations.length} conversations`);
    this.response.update({
      status: "success",
      conversations: usecaseResponse.conversations,
    });
  }

  async presentError(usecaseErrorResponse: TListConversationsErrorResponse): Promise<void> {
    this.logger.error({usecaseErrorResponse}, `Failed to retrieve conversations: ${usecaseErrorResponse.message}`);
    this.response.update({
      status: "error",
      message: usecaseErrorResponse.message,
      context: usecaseErrorResponse.context,
    });
  }
}
