import { injectable } from "inversify";
import { TListResearchContextsViewModel } from "~/lib/core/view-models/list-research-contexts-view-models";

export interface TListResearchContextsControllerParameters {
    response: TListResearchContextsViewModel;
    clientID: string;
}

@injectable()
export default class ListResearchContextsController {
    async execute(params: TListResearchContextsControllerParameters): Promise<void> {
        // TODO: implement presenter and usecase, wire up in the server container via appropriate server-ioc-symbols 
    }
}