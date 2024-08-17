/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type ListConversationsOutputPort } from "~/lib/core/ports/primary/list-conversations-primary-ports";
import { type TListConversationsSuccessResponse, type TListConversationsErrorResponse } from "~/lib/core/usecase-models/list-conversations-usecase-models";
import { type TListConversationsErrorViewModel, type TListConversationsSuccessViewModel } from "~/lib/core/view-models/list-conversations-view-model";

export default class ListConversationsPresenter implements ListConversationsOutputPort {
  presentSuccess(success: TListConversationsSuccessResponse): TListConversationsSuccessViewModel {
    return {
      status: "success",
      conversations: success.conversations,
    };
  }

  presentError(error: TListConversationsErrorResponse): TListConversationsErrorViewModel {
    return {
      status: "error",
      message: error.message,
      context: error.context,
    };
  }
}
