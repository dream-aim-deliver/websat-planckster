import { injectable } from "inversify";
import { TSignal } from "~/lib/core/entity/signals";
import { TSendMessageToConversationViewModel } from "~/lib/core/view-models/send-message-to-conversation-view-model";

export interface TBrowserSendMessageToConversationControllerParameters {
    response: TSignal<TSendMessageToConversationViewModel>;
    researchContextId: string;
    conversationId: string;
    message: string;
}

@injectable()
export default class BrowserSendMessageToConversationController {
    async execute(params: TBrowserSendMessageToConversationControllerParameters): Promise<void> {
        throw new Error("Method not implemented.");
    }
}
