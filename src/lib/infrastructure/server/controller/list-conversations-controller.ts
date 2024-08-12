import { injectable } from "inversify";
import { TListConversationsViewModel } from "~/lib/core/view-models/list-conversations-view-model";
import ListConversationsPresenter from "../presenter/list-conversations-presenter";
import serverContainer from "../config/ioc/server-container";
import KernelConversationGateway from "../gateway/kernel-conversation-gateway";
import { GATEWAYS } from "../config/ioc/server-ioc-symbols";

export interface TListConversationsControllerParameters {
    response: TListConversationsViewModel;
    researchContextID: string;
}

@injectable()
export default class ListConversationsController {
    async execute(params: TListConversationsControllerParameters): Promise<void> {
        try {

            const { researchContextID } = params;

            /** 
             * TODO: move to USECASE
             */

            const presenter = new ListConversationsPresenter(params.response);  // will be injected

            const conversationGateway = serverContainer.get<KernelConversationGateway>(GATEWAYS.KERNEL_CONVERSATION_GATEWAY);  // will be injected

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
            const presenter = new ListConversationsPresenter(params.response);
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
