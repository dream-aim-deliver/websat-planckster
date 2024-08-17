import { injectable } from "inversify";
import { TListConversationsErrorViewModel, TListConversationsSuccessViewModel, TListConversationsViewModel } from "~/lib/core/view-models/list-conversations-view-model";
import serverContainer from "../config/ioc/server-container";
import KernelConversationGateway from "../gateway/kernel-conversation-gateway";
import { GATEWAYS } from "../config/ioc/server-ioc-symbols";

export interface TListConversationsControllerParameters {
  researchContextID: number;
}

@injectable()
export default class ListConversationsController {
  async execute(params: TListConversationsControllerParameters): Promise<TListConversationsViewModel> {
    try {
      const { researchContextID } = params;

      /**
       * TODO: move to USECASE
       */

      const conversationGateway = serverContainer.get<KernelConversationGateway>(GATEWAYS.KERNEL_CONVERSATION_GATEWAY); // will be injected

      const listConversationsDTO = await conversationGateway.listConversations(researchContextID);

      if (!listConversationsDTO.success) {
        const viewModel: TListConversationsErrorViewModel = {
          status: "error",
          message: listConversationsDTO.data.message,
          context: {
            researchContextId: researchContextID,
          },
        };
        return viewModel;
      }

      const conversations = listConversationsDTO.data;

      const viewModel: TListConversationsSuccessViewModel = {
        status: "success",
        conversations: conversations,
      };

      return viewModel;
    } catch (error) {
      const err = error as Error;
      const viewModel: TListConversationsErrorViewModel = {
        status: "error",
        message: err.message,
        context: {
          researchContextId: params.researchContextID,
        },
      };
      return viewModel;
    }
  }
}
