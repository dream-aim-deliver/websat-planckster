import { injectable } from "inversify";
import { TCreateConversationErrorViewModel, TCreateConversationSuccessViewModel, TCreateConversationViewModel } from "~/lib/core/view-models/create-conversation-view-model";
import serverContainer from "../config/ioc/server-container";
import KernelConversationGateway from "../gateway/kernel-conversation-gateway";
import { GATEWAYS } from "../config/ioc/server-ioc-symbols";

export interface TCreateConversationControllerParameters {
  researchContextID: number;
  title: string;
}

@injectable()
export default class CreateConversationController {
  async execute(params: TCreateConversationControllerParameters): Promise<TCreateConversationViewModel> {
    try {
      const { researchContextID, title } = params;

      /**
       * TODO: move to USECASE
       */
      const conversationGateway = serverContainer.get<KernelConversationGateway>(GATEWAYS.KERNEL_CONVERSATION_GATEWAY); // will be injected

      const createConversationDTO = await conversationGateway.createConversation(researchContextID, title);

      if (!createConversationDTO.success) {
        const viewModel: TCreateConversationErrorViewModel = {
          status: "error",
          message: createConversationDTO.data.message,
          context: {
            researchContextId: researchContextID,
            title: title,
          },
        };

        return viewModel;
      }

      const conversation = createConversationDTO.data;

      const viewModel: TCreateConversationSuccessViewModel = {
        status: "success",
        conversation: conversation,
      };

      return viewModel;
    } catch (error) {
      const err = error as Error;
      const viewModel: TCreateConversationErrorViewModel = {
        status: "error",
        message: err.message,
        context: {
          researchContextId: params.researchContextID,
          title: params.title,
        },
      };

      return viewModel;
    }
  }
}
