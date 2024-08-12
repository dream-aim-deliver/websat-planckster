/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type ListConversationsOutputPort } from "~/lib/core/ports/primary/list-conversations-primary-ports";
import { type TListConversationsSuccessResponse, type TListConversationsErrorResponse } from "~/lib/core/usecase-models/list-conversations-usecase-models";
import { type TListConversationsViewModel } from "~/lib/core/view-models/list-conversations-view-model";

export default class ListConversationsPresenter implements ListConversationsOutputPort<TListConversationsViewModel> {
    response: TListConversationsViewModel;
    constructor(response: TListConversationsViewModel) {
        this.response = response;
    }
    presentSuccess(success: TListConversationsSuccessResponse): void {
        this.response = {
            status: "success",
            conversations: success.conversations
        };
    }

    presentError(error: TListConversationsErrorResponse): void {
        this.response = {
            status: "error",
            message: error.message,
            context: error.context
        };
    }
}