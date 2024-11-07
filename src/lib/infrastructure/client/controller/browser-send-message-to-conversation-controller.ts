import { injectable } from "inversify";
import { Signal } from "~/lib/core/entity/signals";
import { TSendMessageToConversationRequest } from "~/lib/core/usecase-models/send-message-to-conversation-usecase-models";
import { TSendMessageToConversationViewModel } from "~/lib/core/view-models/send-message-to-conversation-view-model";
import clientContainer from "../config/ioc/client-container";
import { SendMessageToConversationInputPort } from "~/lib/core/ports/primary/send-message-to-conversation-primary-ports";
import { USECASE_FACTORY } from "../config/ioc/client-ioc-symbols";

export interface TBrowserSendMessageToConversationControllerParameters {
  response: Signal<TSendMessageToConversationViewModel>;
  researchContextExternalID: string;
  conversationID: number;
  messageToSendContent: string;
  messageToSendTimestamp: string;
}

@injectable()
export default class BrowserSendMessageToConversationController {
  async execute(controllerParameters: TBrowserSendMessageToConversationControllerParameters): Promise<void> {
    const { response, researchContextExternalID: researchContextID, conversationID, messageToSendContent, messageToSendTimestamp } = controllerParameters;

    const request: TSendMessageToConversationRequest = {
      status: "request",
      researchContextExternalID: researchContextID,
      conversationID: conversationID,
      messageToSendContent: messageToSendContent,
      messageToSendTimestamp: messageToSendTimestamp,
    };

    const usecaseFactory = clientContainer.get<(response: Signal<TSendMessageToConversationViewModel>) => SendMessageToConversationInputPort>(USECASE_FACTORY.SEND_MESSAGE_TO_CONVERSATION);
    const usecase = usecaseFactory(response);
    await usecase.execute(request);
  }
}
