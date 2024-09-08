import { injectable } from "inversify";
import { Signal } from "~/lib/core/entity/signals";
import { TListMessagesForConversationViewModel } from "~/lib/core/view-models/list-messages-for-conversation-view-model";
import clientContainer from "../config/ioc/client-container";
import { TVanillaAPI } from "../trpc/vanilla-api";
import { TRPC } from "../config/ioc/client-ioc-symbols";

export interface TBrowserListMessagesForConversationControllerParameters {
  response: Signal<TListMessagesForConversationViewModel>;
  conversationID: number;
}

@injectable()
export default class BrowserListMessagesForConversationController {
  async execute(params: TBrowserListMessagesForConversationControllerParameters): Promise<void> {
    try {
      const { response, conversationID } = params;

      const api = clientContainer.get<TVanillaAPI>(TRPC.VANILLA_CLIENT);

      const serverResponse: Signal<TListMessagesForConversationViewModel> = await api.controllers.message.list.query({
        conversationID: conversationID,
      });

      response.update(serverResponse.value);
    } catch (error) {
      const err = error as Error;
      const viewModel: TListMessagesForConversationViewModel = {
        status: "error",
        message: err.message,
        context: {
          conversationID: params.conversationID,
        },
      };
      params.response.update(viewModel);
    }
  }
}
