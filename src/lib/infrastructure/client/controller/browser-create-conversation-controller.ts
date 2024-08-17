import { inject, injectable } from "inversify";
import { TCreateConversationErrorViewModel, TCreateConversationViewModel } from "~/lib/core/view-models/create-conversation-view-model";
import { TRPC } from "../config/ioc/client-ioc-symbols";
import { type TVanillaAPI } from "../trpc/vanilla-api";

export interface TBrowserCreateConversationControllerParameters {
  researchContextID: number;
  title: string;
}

@injectable()
export default class BrowserCreateConversationController {
  constructor(@inject(TRPC.VANILLA_CLIENT) private api: TVanillaAPI) {}

  async execute(params: TBrowserCreateConversationControllerParameters): Promise<TCreateConversationViewModel> {
    try {
      const { researchContextID, title } = params;

      const viewModel = await this.api.kernel.conversation.create.mutate({
        researchContextID: researchContextID,
        conversationTitle: title,
      });

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
