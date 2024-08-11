import { type TSignal } from "~/lib/core/entity/signals";
import { type ListConversationsOutputPort } from "~/lib/core/ports/primary/list-conversations-primary-ports";
import { type TListConversationsSuccessResponse, type TListConversationsErrorResponse } from "~/lib/core/usecase-models/list-conversations-usecase-models";
import { type TListConversationsViewModel } from "~/lib/core/view-models/list-conversations-view-model";

export default class BrowserListConversationsPresenter implements ListConversationsOutputPort<TSignal<TListConversationsViewModel>> {
    response: TSignal<TListConversationsViewModel>;
    constructor(response: TSignal<TListConversationsViewModel>) {
        this.response = response;
    }
    presentSuccess(response: TListConversationsSuccessResponse): void {
        throw new Error("Method not implemented.");
    }
    presentError(response: TListConversationsErrorResponse): void {
        throw new Error("Method not implemented.");
    }
}