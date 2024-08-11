import { injectable } from "inversify";
import { TSignal } from "~/lib/core/entity/signals";
import { SendMessageToConversationInputPort } from "~/lib/core/ports/primary/send-message-to-conversation-primary-ports";
import { TSendMessageToConversationViewModel } from "~/lib/core/view-models/send-message-to-conversation-view-model";
import clientContainer from "../config/ioc/client-container";

export interface TBrowserSendMessageToConversationControllerParameters {
    response: TSignal<TSendMessageToConversationViewModel>;
    researchContextId: string;
    conversationId: string;
    message: string;
}

@injectable()
export default class BrowserSendMessageToConversationController {
    async execute(params: TBrowserSendMessageToConversationControllerParameters): Promise<void> {

        //const usecaseFactory: (response: TSignal<TSendMessageToConversationViewModel>) => SendMessageToConversationInputPort = clientContainer.get(USECASE)
        
    }
}
