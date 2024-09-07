import { injectable } from "inversify";
import { Signal } from "~/lib/core/entity/signals";
import { TListConversationsErrorViewModel, TListConversationsViewModel } from "~/lib/core/view-models/list-conversations-view-model";
import { TRPC } from "../config/ioc/client-ioc-symbols";
import { type TVanillaAPI } from "../trpc/vanilla-api";
import clientContainer from "../config/ioc/client-container";

export interface BrowserListConversationsControllerParameters {
  response: Signal<TListConversationsViewModel>;
  researchContextID: number;
}

@injectable()
export default class BrowserListConversationsController {

  async execute(params: BrowserListConversationsControllerParameters): Promise<void> {
    try {
      const { researchContextID } = params;

      const api = clientContainer.get<TVanillaAPI>(TRPC.VANILLA_CLIENT);

      const viewModel: TListConversationsViewModel = await api.kernel.conversation.list.query({
        researchContextID: researchContextID,
      });

      params.response.update(viewModel);

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
