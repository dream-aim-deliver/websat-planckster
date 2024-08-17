import { inject, injectable } from "inversify";
import { TSignal } from "~/lib/core/entity/signals";
import { TListConversationsErrorViewModel, TListConversationsViewModel } from "~/lib/core/view-models/list-conversations-view-model";
import { TRPC } from "../config/ioc/client-ioc-symbols";
import { type TVanillaAPI } from "../trpc/vanilla-api";

export interface BrowserListConversationsControllerParameters {
  response: TSignal<TListConversationsViewModel>;
  researchContextID: number;
}

@injectable()
export default class BrowserListConversationsController {
  constructor(@inject(TRPC.VANILLA_CLIENT) private api: TVanillaAPI) {}

  async execute(params: BrowserListConversationsControllerParameters): Promise<TListConversationsViewModel> {
    try {
      const { researchContextID } = params;

      const viewModel = await this.api.kernel.conversation.list.query({
        researchContextID: researchContextID,
      });

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
