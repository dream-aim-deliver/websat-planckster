import { injectable } from "inversify";
import { TSignal } from "~/lib/core/entity/signals";
import { TListMessagesForConversationViewModel } from "~/lib/core/view-models/list-messages-for-conversation-view-model";
import ListMessagesForConversationPresenter from "../presenter/list-messages-for-conversation-presenter";
import KernelConversationGateway from "../gateway/kernel-conversation-gateway";
import serverContainer from "../config/ioc/server-container";
import { GATEWAYS } from "../config/ioc/server-ioc-symbols";

export interface TListMessagesForConversationControllerParameters {
    conversationID: string;
    response: TSignal<TListMessagesForConversationViewModel>;

}

@injectable()
export default class ListMessagesForConversationController {
    async execute(params: TListMessagesForConversationControllerParameters): Promise<void> {
        try {

            const { conversationID } = params;

            /**
             * TODO: move to USECASE
            */

            const presenter = new ListMessagesForConversationPresenter(params.response);  // will be injected

            const conversationGateway = serverContainer.get<KernelConversationGateway>(GATEWAYS.KERNEL_CONVERSATION_GATEWAY);  // would be injected

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
            const presenter = new ListMessagesForConversationPresenter(params.response);
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
