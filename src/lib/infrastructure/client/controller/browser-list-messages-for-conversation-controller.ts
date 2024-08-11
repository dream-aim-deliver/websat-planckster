import { injectable } from "inversify";
import { TSignal } from "~/lib/core/entity/signals";
import { TListMessagesForConversationViewModel } from "~/lib/core/view-models/list-messages-for-conversation-view-model";
import BrowserListMessagesForConversationPresenter from "../presenter/browser-list-messages-for-conversation-presenter";
import clientContainer from "../config/ioc/client-container";
import BrowserConversationGateway from "../gateway/browser-conversation-gateway";
import { GATEWAYS } from "../config/ioc/client-ioc-symbols";

export interface TBrowserListMessagesForConversationControllerParameters {
    conversationID: string;
    response: TSignal<TListMessagesForConversationViewModel>;

}

@injectable()
export default class BrowserListMessagesForConversationController {
    async execute(params: TBrowserListMessagesForConversationControllerParameters): Promise<void> {
        try {

            const { conversationID } = params;

            /**
             * TODO: move to USECASE
            */

            const presenter = new BrowserListMessagesForConversationPresenter(params.response);  // will be injected

            const conversationGateway = clientContainer.get<BrowserConversationGateway>(GATEWAYS.CONVERSATION_GATEWAY);  // would be injected

            const listMessagesForConversationDTO = await conversationGateway.getConversationMessages(conversationID);

            if (!listMessagesForConversationDTO.success) {
                presenter.presentError({
                    message: listMessagesForConversationDTO.data.message,
                    operation: "list-messages-for-conversation",
                    context: {
                        conversationId: conversationID,
                    },
                });
                return;
            }

            const messages = listMessagesForConversationDTO.data;

            presenter.presentSuccess({
                messages: messages,
            });

            return;


        } catch (error) {
            const err = error as Error;
            const presenter = new BrowserListMessagesForConversationPresenter(params.response);
            presenter.presentError({
                message: err.message,
                operation: "list-messages-for-conversation",
                context: {
                    conversationID: params.conversationID,
                },
            });

        }




    }
}