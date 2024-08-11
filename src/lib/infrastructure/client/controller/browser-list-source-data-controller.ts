import { inject, injectable } from "inversify";
import { TSignal } from "~/lib/core/entity/signals";
import { TListSourceDataViewModel } from "~/lib/core/view-models/list-source-data-view-models";
import { TRPC } from "../config/ioc/client-ioc-symbols";
import type { TVanillaAPI } from "../trpc/vanilla-api";

export interface TBrowserListSourceDataControllerParameters {
    response: TSignal<TListSourceDataViewModel>;
    researchContextId?: string;
}

@injectable()
export default class BrowserListSourceDataController {
    constructor(
        @inject(TRPC.VANILLA_CLIENT) private api: TVanillaAPI
    ) {}
    async execute(params: TBrowserListSourceDataControllerParameters): Promise<void> {
        // if(params.researchContextId ) {
        //     this.api.kernel.sourceData.listForResearchContext({params.researchContextId})
        // }
    }
}