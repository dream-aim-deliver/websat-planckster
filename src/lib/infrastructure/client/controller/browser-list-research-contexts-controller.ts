import { injectable } from "inversify";
import { Signal } from "~/lib/core/entity/signals";
import { TListResearchContextsViewModel } from "~/lib/core/view-models/list-research-contexts-view-models";

export interface TBrowserListResearchContextsControllerParameters {
    response: Signal<TListResearchContextsViewModel>;
}

@injectable()
export default class BrowserListResearchContextsController {
    async execute(params: TBrowserListResearchContextsControllerParameters): Promise<void> {
        throw new Error("Method not implemented.");
    }
}