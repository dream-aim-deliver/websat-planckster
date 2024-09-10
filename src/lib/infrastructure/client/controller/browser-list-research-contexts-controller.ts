import { injectable } from "inversify";
import { Signal } from "~/lib/core/entity/signals";
import { TListResearchContextsViewModel } from "~/lib/core/view-models/list-research-contexts-view-models";
import clientContainer from "../config/ioc/client-container";
import { USECASE_FACTORY } from "../config/ioc/client-ioc-symbols";
import { TListResearchContextsRequest } from "~/lib/core/usecase-models/list-research-contexts-usecase-models";
import { ListResearchContextsInputPort } from "~/lib/core/ports/primary/list-research-contexts-primary-ports";

export interface TBrowserListResearchContextsControllerParameters {
  response: Signal<TListResearchContextsViewModel>;
}

@injectable()
export default class BrowserListResearchContextsController {
  async execute(params: TBrowserListResearchContextsControllerParameters): Promise<void> {
    const { response } = params;

    const request: TListResearchContextsRequest = {
      status: "request",
    };

    const usecaseFactory = clientContainer.get<(response: Signal<TListResearchContextsViewModel>) => ListResearchContextsInputPort>(USECASE_FACTORY.LIST_RESEARCH_CONTEXTS);

    const usecase = usecaseFactory(response);

    await usecase.execute(request);
  }
}
