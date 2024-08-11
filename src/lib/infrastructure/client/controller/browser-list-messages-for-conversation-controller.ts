import { injectable } from "inversify";
import { TSignal } from "~/lib/core/entity/signals";
import { TListMessagesForConversationViewModel } from "~/lib/core/view-models/list-messages-for-conversation-view-model";

export interface TBrowserListMessagesForConversationControllerParameters {
    response: TSignal<TListMessagesForConversationViewModel>;
    researchContextId: string;
    conversationId: string;
}

@injectable()
export default class BrowserListMessagesForConversationController {
    async execute(params: TBrowserListMessagesForConversationControllerParameters): Promise<void> {
        throw new Error("Method not implemented.");
    }
}