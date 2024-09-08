import { inject, injectable } from "inversify";
import { TRPC } from "../config/ioc/client-ioc-symbols";
import { TListSourceDataErrorViewModel, TListSourceDataViewModel } from "~/lib/core/view-models/list-source-data-view-models";
import { type TVanillaAPI } from "../trpc/vanilla-api";
import { Signal } from "~/lib/core/entity/signals";
import clientContainer from "../config/ioc/client-container";

export interface TBrowserListSourceDataControllerParameters {
  response: Signal<TListSourceDataViewModel>;
  researchContextID?: number;
}

@injectable()
export default class BrowserListSourceDataController {
  async execute(params: TBrowserListSourceDataControllerParameters): Promise<void> {
    try {
      const { response, researchContextID } = params;

      const api = clientContainer.get<TVanillaAPI>(TRPC.VANILLA_CLIENT);

      const serverResponse: Signal<TListSourceDataViewModel> = await api.controllers.sourceData.list.query({
        researchContextID: researchContextID,
      });

      response.update(serverResponse.value);
    } catch (error) {
      const err = error as Error;

      const viewModel: TListSourceDataErrorViewModel = {
        status: "error",
        message: err.message,
        context: {
          researchContextId: params.researchContextID,
        },
      };

      params.response.update(viewModel);
    }
  }
}
