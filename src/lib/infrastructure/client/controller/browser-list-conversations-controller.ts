import { injectable } from "inversify";
import { Signal } from "~/lib/core/entity/signals";
import { TListConversationsErrorViewModel, TListConversationsViewModel } from "~/lib/core/view-models/list-conversations-view-model";
import { TRPC } from "../config/ioc/client-ioc-symbols";
import { type TVanillaAPI } from "../trpc/vanilla-api";
import clientContainer from "../config/ioc/client-container";

export interface TBrowserListConversationsControllerParameters {
  response: Signal<TListConversationsViewModel>;
  researchContextID: number;
}

@injectable()
export default class BrowserListConversationsController {

  async execute(params: TBrowserListConversationsControllerParameters): Promise<void> {
    try {
      const { researchContextID, response } = params;

      const api = clientContainer.get<TVanillaAPI>(TRPC.VANILLA_CLIENT);
      const serverResponse: Signal<TListConversationsViewModel> = await api.controllers.conversation.list.query({
        researchContextID: researchContextID,
      })
      response.update(serverResponse.value);

    } catch (error) {
      const err = error as Error;
      const viewModel: TListConversationsErrorViewModel = {
        status: "error",
        message: err.message,
        context: {
          researchContextId: params.researchContextID,
        },
      };
      params.response.update(viewModel);
    }
  }
}
