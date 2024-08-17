import { injectable } from "inversify";
import { TCreateConversationErrorViewModel, TCreateConversationViewModel } from "~/lib/core/view-models/create-conversation-view-model";
import serverContainer from "../config/ioc/server-container";
import { USECASE_FACTORY } from "../config/ioc/server-ioc-symbols";
import { CreateConversationInputPort } from "~/lib/core/ports/primary/create-conversation-primary-ports";
import CreateConversationPresenter from "../presenter/create-conversation-presenter";

export interface TCreateConversationControllerParameters {
  researchContextID: number;
  title: string;
}

@injectable()
export default class CreateConversationController {
  async execute(params: TCreateConversationControllerParameters): Promise<TCreateConversationViewModel> {
    try {
      const { researchContextID, title } = params;

      const usecaseFactory: () => CreateConversationInputPort = serverContainer.get(USECASE_FACTORY.CREATE_CONVERSATION);
      const usecase = usecaseFactory();

      const presenter = new CreateConversationPresenter();

      const responseModel = await usecase.execute({
        researchContextID: researchContextID,
        conversationTitle: title,
      });

      if (responseModel.status == "success") {
        return presenter.presentSuccess(responseModel);
      } else {
        return presenter.presentError(responseModel);
      }
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
