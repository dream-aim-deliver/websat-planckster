/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type CreateConversationOutputPort } from "~/lib/core/ports/primary/create-conversation-primary-ports";
import { type TCreateConversationSuccessResponse, type TCreateConversationErrorResponse } from "~/lib/core/usecase-models/create-conversation-usecase-models";
import type { TCreateConversationErrorViewModel, TCreateConversationSuccessViewModel } from "~/lib/core/view-models/create-conversation-view-model";

export default class CreateConversationPresenter implements CreateConversationOutputPort {
  presentSuccess(success: TCreateConversationSuccessResponse): TCreateConversationSuccessViewModel {
    return {
      status: "success",
      conversation: success.conversation,
    };
  }

  presentError(error: TCreateConversationErrorResponse): TCreateConversationErrorViewModel {
    return {
      status: "error",
      message: error.message,
      context: error.context,
    };
  }
}
