import type { Signal } from "~/lib/core/entity/signals";
import type { TCreateResearchContextViewModel } from "~/lib/core/view-models/create-research-context-view-models";
import type { RemoteFile } from "~/lib/core/entity/file";
import { injectable } from "inversify";

export interface TBrowserCreateResearchContextControllerParameters {
    response: Signal<TCreateResearchContextViewModel>;
    title: string;
    description: string;
    sourceDataList: RemoteFile[];
}

@injectable()
export default class BrowserCreateResearchContextController {
    async execute(params: TBrowserCreateResearchContextControllerParameters): Promise<void> {
        // const bridgingRequest = {
        //     wallet: activeWallet,
        //     network: network,
        //     toNetwork: toNetwork,
        //     amount: amount,
        //   };
        //   const usecaseFactory: (response: TSignal<TBridgingViewModel>) => BridgingInputPort = clientContainer.get(USECASE.BRIDGING_USECASE_FACTORY);
        //   const usecase = usecaseFactory(response);
        //   await usecase.execute(bridgingRequest);
    }
}