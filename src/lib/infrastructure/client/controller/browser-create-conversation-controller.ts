import { injectable } from "inversify";
import { TSignal } from "~/lib/core/entity/signals";
import { TCreateConversationViewModel } from "~/lib/core/view-models/create-conversation-view-model";
import BrowserCreateConversationPresenter from "../presenter/browser-create-conversation-presenter";
import clientContainer from "../config/ioc/client-container";
import { GATEWAYS } from "../config/ioc/client-ioc-symbols";
import BrowserConversationGateway from "../gateway/browser-conversation-gateway";

export interface TBrowserCreateConversationControllerParameters {
    response: TSignal<TCreateConversationViewModel>;
    researchContextID: string;
    title: string;
}

@injectable()
export default class BrowserCreateConversationController {
    async execute(params: TBrowserCreateConversationControllerParameters): Promise<void> {
        try {

            const { researchContextID, title } = params;

            /**
             * TODO: move to USECASE
             */
            const presenter = new BrowserCreateConversationPresenter(params.response); // will be injected

            const conversationGateway = clientContainer.get<BrowserConversationGateway>(GATEWAYS.CONVERSATION_GATEWAY); // would be injected

            const createConversationDTO = await conversationGateway.createConversation(researchContextID, title);

 
            if (!createConversationDTO.success) {
                presenter.presentError({
                    message: createConversationDTO.data.message,
                    operation: "create-conversation",
                    context: {
                        researchContextId: researchContextID,
                        title: title,
                    },
                });
                return;
            }

            const conversation = createConversationDTO.data;

            presenter.presentSuccess({
                conversation: conversation
            });

            return;


        } catch (error) {
            const err = error as Error;
            const presenter = new BrowserCreateConversationPresenter(params.response);
            presenter.presentError({
                message: err.message,
                operation: "create-conversation",
                context: {
                    researchContextId: params.researchContextID,
                    title: params.title,
                },
            });


        }





    }
}