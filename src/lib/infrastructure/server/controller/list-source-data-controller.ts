import { injectable } from "inversify";
import serverContainer from "../config/ioc/server-container";
import { USECASE_FACTORY } from "../config/ioc/server-ioc-symbols";
import { TListSourceDataViewModel } from "~/lib/core/view-models/list-source-data-view-models";
import { ListSourceDataInputPort } from "~/lib/core/ports/primary/list-source-data-primary-ports";
import { Signal } from "~/lib/core/entity/signals";
import { TListSourceDataRequest } from "~/lib/core/usecase-models/list-source-data-usecase-models";

export interface TListSourceDataControllerParameters {
  response: Signal<TListSourceDataViewModel>;
  researchContextID?: number;
}

@injectable()
export default class ListSourceDataController {
  async execute(params: TListSourceDataControllerParameters): Promise<void> {
    const { response, researchContextID } = params;
    const request: TListSourceDataRequest = {
      researchContextID,
    };
    const usecaseFactory = serverContainer.get<(response: Signal<TListSourceDataViewModel>) => ListSourceDataInputPort>(USECASE_FACTORY.LIST_SOURCE_DATA);

    const usecase = usecaseFactory(response);
    await usecase.execute(request);
  }
}
