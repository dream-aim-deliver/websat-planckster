import { injectable } from "inversify";
import { TCreateConversationErrorViewModel, TCreateConversationViewModel } from "~/lib/core/view-models/create-conversation-view-model";
import { TRPC } from "../config/ioc/client-ioc-symbols";
import { type TVanillaAPI } from "../trpc/vanilla-api";
import { Signal } from "~/lib/core/entity/signals";
import clientContainer from "../config/ioc/client-container";

export interface TBrowserCreateConversationControllerParameters {
  response: Signal<TCreateConversationViewModel>;
  researchContextID: number;
  title: string;
}

@injectable()
export default class BrowserCreateConversationController {

  async execute(params: TBrowserCreateConversationControllerParameters): Promise<void> {
    try {
      const { response, researchContextID, title } = params;

      const api = clientContainer.get<TVanillaAPI>(TRPC.VANILLA_CLIENT);

      const serverResponse: Signal<TCreateConversationViewModel> = await api.controllers.conversation.create.mutate({
        researchContextID: researchContextID,
        conversationTitle: title,
      })

      response.update(serverResponse.value);

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
      params.response.update(viewModel);
    }
  }
}
