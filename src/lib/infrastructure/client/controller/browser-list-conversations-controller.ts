import { injectable } from "inversify";
import { TSignal } from "~/lib/core/entity/signals";
import { TListConversationsViewModel } from "~/lib/core/view-models/list-conversations-view-model";
import BrowserListConversationsPresenter from "../presenter/browser-list-conversations-presenter";
import clientContainer from "../config/ioc/client-container";
import BrowserConversationGateway from "../gateway/browser-conversation-gateway";
import { GATEWAYS } from "../config/ioc/client-ioc-symbols";

export interface BrowserListConversationsControllerParameters {
    response: TSignal<TListConversationsViewModel>;
    researchContextID: string;
}

@injectable()
export default class BrowserListConversationsController {
    async execute(params: BrowserListConversationsControllerParameters): Promise<void> {
        try {

            const { researchContextID } = params;

            /** 
             * TODO: move to USECASE
             */

            const presenter = new BrowserListConversationsPresenter(params.response);  // will be injected

            const conversationGateway = clientContainer.get<BrowserConversationGateway>(GATEWAYS.CONVERSATION_GATEWAY);  // would be injected

            const listConversationsDTO = await conversationGateway.listConversations(researchContextID);

            if (!listConversationsDTO.success) {
                presenter.presentError({
                    message: listConversationsDTO.data.message,
                    operation: "list-conversations",
                    context: {
                        researchContextId: researchContextID,
                    },
                });
                return;
            }

            const conversations = listConversationsDTO.data;

            presenter.presentSuccess({
                conversations: conversations,
            });

            return;


        } catch (error) {

            const err = error as Error;
            const presenter = new BrowserListConversationsPresenter(params.response);
            presenter.presentError({
                message: err.message,
                operation: "list-conversations",
                context: {
                    researchContextId: params.researchContextID,
                },
            });



        }




    }
}