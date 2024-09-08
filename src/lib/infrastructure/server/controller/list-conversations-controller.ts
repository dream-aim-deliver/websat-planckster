import { injectable } from "inversify";
import { TListConversationsViewModel } from "~/lib/core/view-models/list-conversations-view-model";
import serverContainer from "../config/ioc/server-container";
import { USECASE_FACTORY } from "../config/ioc/server-ioc-symbols";
import { ListConversationsInputPort } from "~/lib/core/ports/primary/list-conversations-primary-ports";
import { Signal } from "~/lib/core/entity/signals";
import { TListConversationsRequest } from "~/lib/core/usecase-models/list-conversations-usecase-models";

export interface TListConversationsControllerParameters {
  response: Signal<TListConversationsViewModel>;
  researchContextID: number;
}

@injectable()
export default class ListConversationsController {
  async execute(params: TListConversationsControllerParameters): Promise<void> {
    const { response, researchContextID } = params;
    const request: TListConversationsRequest = {
      researchContextID,
    };
    const usecaseFactory = serverContainer.get<(response: Signal<TListConversationsViewModel>) => ListConversationsInputPort>(USECASE_FACTORY.LIST_CONVERSATIONS);
    const usecase = usecaseFactory(response);
    await usecase.execute(request);
  }
}
