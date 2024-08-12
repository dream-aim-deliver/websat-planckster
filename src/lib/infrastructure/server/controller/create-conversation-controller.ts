import { injectable } from "inversify";
import { TSignal } from "~/lib/core/entity/signals";
import { TCreateConversationViewModel } from "~/lib/core/view-models/create-conversation-view-model";
import CreateConversationPresenter from "../presenter/create-conversation-presenter";
import serverContainer from "../config/ioc/server-container";
import KernelConversationGateway from "../gateway/kernel-conversation-gateway";
import { GATEWAYS } from "../config/ioc/server-ioc-symbols";


export interface TCreateConversationControllerParameters {
    response: TSignal<TCreateConversationViewModel>;
    researchContextID: string;
    title: string;
}

@injectable()
export default class CreateConversationController {
    async execute(params: TCreateConversationControllerParameters): Promise<void> {
        try {

            const { researchContextID, title } = params;

            /**
             * TODO: move to USECASE
             */
            const presenter = new CreateConversationPresenter(params.response); // will be injected

            const conversationGateway = serverContainer.get<KernelConversationGateway>(GATEWAYS.KERNEL_CONVERSATION_GATEWAY);  // will be injected

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
            const presenter = new CreateConversationPresenter(params.response);
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
