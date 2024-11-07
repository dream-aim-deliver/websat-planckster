import type { Signal } from "~/lib/core/entity/signals";
import type { TCreateResearchContextViewModel } from "~/lib/core/view-models/create-research-context-view-models";
import type { RemoteFile } from "~/lib/core/entity/file";
import { injectable } from "inversify";
import type { CreateResearchContextInputPort } from "~/lib/core/ports/primary/create-research-context-primary-ports";
import clientContainer from "../config/ioc/client-container";
import { USECASE_FACTORY } from "../config/ioc/client-ioc-symbols";

export interface TBrowserCreateResearchContextControllerParameters {
  response: Signal<TCreateResearchContextViewModel>;
  title: string;
  description: string;
  sourceDataList: RemoteFile[];
}

@injectable()
export default class BrowserCreateResearchContextController {
  async execute(params: TBrowserCreateResearchContextControllerParameters): Promise<void> {
    try {
      console.log({ params: params.sourceDataList }, "BrowserCreateResearchContextController: sourceDataList");

      const usecaseFactory: (response: Signal<TCreateResearchContextViewModel>) => CreateResearchContextInputPort = clientContainer.get(USECASE_FACTORY.CREATE_RESEARCH_CONTEXT);
      const usecase = usecaseFactory(params.response);
      await usecase.execute({
        title: params.title,
        description: params.description,
        sourceDataList: params.sourceDataList,
      });
    } catch (error) {
      const err = error as Error;
      const viewModel: TCreateResearchContextViewModel = {
        status: "error",
        message: err.message,
        context: {
          title: params.title,
          description: params.description,
          sourceDataList: params.sourceDataList,
        },
      };
      params.response.update(viewModel);
    }
  }
}
