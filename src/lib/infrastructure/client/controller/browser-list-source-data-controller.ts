import { injectable } from "inversify";
import { TSignal } from "~/lib/core/entity/signals";
import { TListSourceDataViewModel } from "~/lib/core/view-models/list-source-data-view-models";
import BrowserListSourceDataPresenter from "../presenter/browser-list-source-data-presenter";
import clientContainer from "../config/ioc/client-container";
import BrowserSourceDataGateway from "../gateway/browser-source-data-gateway";
import { GATEWAYS } from "../config/ioc/client-ioc-symbols";

export interface TBrowserListSourceDataControllerParameters {
    researchContextID?: string;
    response: TSignal<TListSourceDataViewModel>;
}

@injectable()
export default class BrowserListSourceDataController {

    async execute(params: TBrowserListSourceDataControllerParameters): Promise<void> {

        try {

            const { researchContextID } = params;

            /**
             * TODO: move to USECASE
             */
            const presenter = new BrowserListSourceDataPresenter(params.response);  // will be injected

            const sourceDataGateway = clientContainer.get<BrowserSourceDataGateway>(GATEWAYS.SOURCE_DATA_GATEWAY);  // will be injected

            let listSourceDataDTO;

            /**
             * List all source data for client
             */
            if (!researchContextID) {

                listSourceDataDTO = await sourceDataGateway.list();

                if (!listSourceDataDTO.success) {
                    presenter.presentError({
                        message: listSourceDataDTO.data.message,
                        operation: "list-source-data",
                    });
                    return;
                }

            /**
             * List source data for a research context
             */
            } else {

                listSourceDataDTO = await sourceDataGateway.listForResearchContext(researchContextID);

                if (!listSourceDataDTO.success) {
                    presenter.presentError({
                        message: listSourceDataDTO.data.message,
                        operation: "list-source-data-for-research-context",
                    });
                    return;
                }

            }

            /**
             * Logic is the same for both cases after getting the DTO
             */

            const fileList = listSourceDataDTO.data;

            // NOTE: Need to parse the DTO data to get what we need for the view model
            // if something in the gateway changes, this will need to be updated
            const remoteFileList = fileList.filter(
                (file): file is { type: "remote"; id: string; name: string; relativePath: string; provider: string; createdAt: string; } => file.type === "remote"
            );

            presenter.presentSuccess({
                sourceData: remoteFileList,
            });


        } catch (error) {
            const err = error as Error;
            const presenter = new BrowserListSourceDataPresenter(params.response);
            presenter.presentError({
                message: err.message,
                operation: "list-source-data",
                context: {
                    researchContextId: params.researchContextID,
                },
            });
        }




    }
}