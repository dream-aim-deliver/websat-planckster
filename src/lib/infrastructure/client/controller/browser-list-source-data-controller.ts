import { inject, injectable } from "inversify";
import { TRPC } from "../config/ioc/client-ioc-symbols";
import { TListSourceDataErrorViewModel, TListSourceDataViewModel } from "~/lib/core/view-models/list-source-data-view-models";
import { type TVanillaAPI } from "../trpc/vanilla-api";

export interface TBrowserListSourceDataControllerParameters {
  researchContextID?: number;
}

@injectable()
export default class BrowserListSourceDataController {
  constructor(@inject(TRPC.VANILLA_CLIENT) private api: TVanillaAPI) {}

  async execute(params: TBrowserListSourceDataControllerParameters): Promise<TListSourceDataViewModel> {
    try {
      const { researchContextID } = params;

      const viewModel = await this.api.kernel.sourceData.list.query({
        researchContextID: researchContextID,
      });

      return viewModel;
    } catch (error) {
      const err = error as Error;

      const viewModel: TListSourceDataErrorViewModel = {
        status: "error",
        message: err.message,
        context: {
          researchContextId: params.researchContextID,
        },
      };

      return viewModel;
    }
  }
}
