/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type TSignal } from "~/lib/core/entity/signals";
import { type ListConversationsOutputPort } from "~/lib/core/ports/primary/list-conversations-primary-ports";
import { type TListConversationsSuccessResponse, type TListConversationsErrorResponse } from "~/lib/core/usecase-models/list-conversations-usecase-models";
import { type TListConversationsViewModel } from "~/lib/core/view-models/list-conversations-view-model";

export default class ListConversationsPresenter implements ListConversationsOutputPort<TSignal<TListConversationsViewModel>> {
    response: TSignal<TListConversationsViewModel>;
    constructor(response: TSignal<TListConversationsViewModel>) {
        this.response = response;
    }
    presentSuccess(success: TListConversationsSuccessResponse): void {
        this.response.update({
            status: "success",
            conversations: success.conversations
        });
    }

    presentError(error: TListConversationsErrorResponse): void {
        this.response.update({
            status: "error",
            message: error.message,
            context: error.context
        });
    }
}