import { injectable } from "inversify";
import { Signal } from "~/lib/core/entity/signals";
import { TListResearchContextsViewModel } from "~/lib/core/view-models/list-research-contexts-view-models";
import serverContainer from "../config/ioc/server-container";
import { ListResearchContextsInputPort } from "~/lib/core/ports/primary/list-research-contexts-primary-ports";
import { USECASE_FACTORY } from "../config/ioc/server-ioc-symbols";

export interface TListResearchContextsControllerParameters {
  response: Signal<TListResearchContextsViewModel>;
}

@injectable()
export default class ListResearchContextsController {
  async execute(params: TListResearchContextsControllerParameters): Promise<void> {

    const { response } = params;

    const usecaseFactory = serverContainer.get<(response: Signal<TListResearchContextsViewModel>) => ListResearchContextsInputPort>(USECASE_FACTORY.LIST_RESEARCH_CONTEXTS);

    const usecase = usecaseFactory(response);
    await usecase.execute();
  }
}
