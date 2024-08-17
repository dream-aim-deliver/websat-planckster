import { injectable } from "inversify";
import { TListConversationsErrorViewModel, TListConversationsSuccessViewModel, TListConversationsViewModel } from "~/lib/core/view-models/list-conversations-view-model";
import serverContainer from "../config/ioc/server-container";
import KernelConversationGateway from "../gateway/kernel-conversation-gateway";
import { GATEWAYS, USECASE_FACTORY } from "../config/ioc/server-ioc-symbols";
import { ListConversationsInputPort } from "~/lib/core/ports/primary/list-conversations-primary-ports";
import ListConversationsPresenter from "../presenter/list-conversations-presenter";

export interface TListConversationsControllerParameters {
  researchContextID: number;
}

@injectable()
export default class ListConversationsController {
  async execute(params: TListConversationsControllerParameters): Promise<TListConversationsViewModel> {
    try {
      const { researchContextID } = params;

      const usecaseFactory: () => ListConversationsInputPort = serverContainer.get(USECASE_FACTORY.LIST_CONVERSATONS);
      const usecase = usecaseFactory();

      const presenter = new ListConversationsPresenter();

      const responseModel = await usecase.execute({
        researchContextID: researchContextID,
      });

      if (responseModel.status == "success") {
        return presenter.presentSuccess(responseModel);
      } else {
        return presenter.presentError(responseModel);
      }
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
