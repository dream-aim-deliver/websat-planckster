import { injectable } from "inversify";
import serverContainer from "../config/ioc/server-container";
import { USECASE_FACTORY } from "../config/ioc/server-ioc-symbols";
import ListSourceDataPresenter from "../presenter/list-source-data-presenter";
import { TListSourceDataErrorViewModel, TListSourceDataViewModel } from "~/lib/core/view-models/list-source-data-view-models";
import { ListSourceDataInputPort } from "~/lib/core/ports/primary/list-source-data-primary-ports";

export interface TListSourceDataControllerParameters {
  researchContextID?: number;
}

@injectable()
export default class ListSourceDataController {
  async execute(params: TListSourceDataControllerParameters): Promise<TListSourceDataViewModel> {
    try {
      const { researchContextID } = params;

      const usecaseFactory: () => ListSourceDataInputPort = serverContainer.get(USECASE_FACTORY.LIST_SOURCE_DATA);
      const usecase = usecaseFactory();

      const presenter = new ListSourceDataPresenter();

      const responseModel = await usecase.execute({ researchContextID });

      if (responseModel.status == "success") {
        return presenter.presentSuccess(responseModel);
      } else {
        return presenter.presentError(responseModel);
      }
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
