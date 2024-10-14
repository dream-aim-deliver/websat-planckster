import { injectable } from "inversify";
import { Signal } from "~/lib/core/entity/signals";
import { TListResearchContextsViewModel } from "~/lib/core/view-models/list-research-contexts-view-models";
import clientContainer from "../config/ioc/client-container";
import { TVanillaAPI } from "../trpc/vanilla-api";
import { TRPC } from "../config/ioc/client-ioc-symbols";

export interface TBrowserListResearchContextsControllerParameters {
    response: Signal<TListResearchContextsViewModel>;
}

@injectable()
export default class BrowserListResearchContextsController {
    async execute(params: TBrowserListResearchContextsControllerParameters): Promise<void> {
        try {
            const { response } = params;

            const api = clientContainer.get<TVanillaAPI>(TRPC.VANILLA_CLIENT);

            const serverResponse: Signal<TListResearchContextsViewModel> = await api.researchContexts.list.listAll.query();

            response.update(serverResponse.value);
        } catch (error) {
            const err = error as Error;
      
            const viewModel: TListResearchContextsViewModel = {
              status: "error",
              message: err.message,
            };
      
            params.response.update(viewModel);
        }
    }
}