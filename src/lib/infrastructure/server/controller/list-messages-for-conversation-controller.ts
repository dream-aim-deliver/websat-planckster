import { injectable } from "inversify";
import { Signal } from "~/lib/core/entity/signals";
import { TListMessagesForConversationViewModel } from "~/lib/core/view-models/list-messages-for-conversation-view-model";
import serverContainer from "../config/ioc/server-container";
import { USECASE_FACTORY } from "../config/ioc/server-ioc-symbols";
import { TListMessagesForConversationRequest } from "~/lib/core/usecase-models/list-messages-for-conversation-usecase-models";
import { ListMessagesForConversationInputPort } from "~/lib/core/ports/primary/list-messages-for-conversation-primary-ports";

export interface TListMessagesForConversationControllerParameters {
  response: Signal<TListMessagesForConversationViewModel>;
  conversationID: number;
}

@injectable()
export default class ListMessagesForConversationController {
  async execute(params: TListMessagesForConversationControllerParameters): Promise<void> {
    const { response, conversationID } = params;
    const request: TListMessagesForConversationRequest = {
      conversationID,
    };
    const usecaseFactory = serverContainer.get<(response: Signal<TListMessagesForConversationViewModel>) => ListMessagesForConversationInputPort>(USECASE_FACTORY.LIST_MESSAGES_FOR_CONVERSATION);
    const usecase = usecaseFactory(response);
    await usecase.execute(request);
  }
}
