import { injectable } from "inversify";
import { Signal } from "~/lib/core/entity/signals";
import { TListResearchContextsViewModel } from "~/lib/core/view-models/list-research-contexts-view-models";

export interface TListResearchContextsControllerParameters {
  response: Signal<TListResearchContextsViewModel>;
  clientID: string;
}

@injectable()
export default class ListResearchContextsController {
  async execute(params: TListResearchContextsControllerParameters): Promise<void> {
    // TODO: implement presenter and usecase, wire up in the server container via appropriate server-ioc-symbols
    params.response.update({
        status: "success",
        researchContexts: [
            {
                id: 1,
                title: "Research Context 1",
                description: "Description of Research Context 1",
            },
        ],
    });
  }
}
