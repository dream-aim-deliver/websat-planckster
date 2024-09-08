import { injectable } from "inversify";
import { TCreateConversationViewModel } from "~/lib/core/view-models/create-conversation-view-model";
import serverContainer from "../config/ioc/server-container";
import { USECASE_FACTORY } from "../config/ioc/server-ioc-symbols";
import { CreateConversationInputPort } from "~/lib/core/ports/primary/create-conversation-primary-ports";
import { TCreateConversationRequest } from "~/lib/core/usecase-models/create-conversation-usecase-models";
import { Signal } from "~/lib/core/entity/signals";

export interface TCreateConversationControllerParameters {
  response: Signal<TCreateConversationViewModel>;
  researchContextID: number;
  conversationTitle: string;
}

@injectable()
export default class CreateConversationController {
  async execute(params: TCreateConversationControllerParameters): Promise<void> {
    const { response, researchContextID, conversationTitle } = params;

    const request: TCreateConversationRequest ={
      researchContextID: researchContextID,
      conversationTitle: conversationTitle,
    };

    const usecaseFactory = serverContainer.get<(response: Signal<TCreateConversationViewModel>) => CreateConversationInputPort>(USECASE_FACTORY.CREATE_CONVERSATION);

    const usecase = usecaseFactory(response);
    await usecase.execute(request); 
  }
}
