import { injectable } from "inversify";
import { TListSourceDataViewModel } from "~/lib/core/view-models/list-source-data-view-models";
import serverContainer from "../config/ioc/server-container";
import KernelSourceDataGateway from "../gateway/kernel-source-data-gateway";
import { GATEWAYS } from "../config/ioc/server-ioc-symbols";
import ListSourceDataPresenter from "../presenter/list-source-data-presenter";

export interface TListSourceDataControllerParameters {
    researchContextID?: string;
    response: TListSourceDataViewModel;
}

@injectable()
export default class ListSourceDataController {

    async execute(params: TListSourceDataControllerParameters): Promise<void> {

        try {

            const { researchContextID } = params;

            /**
             * TODO: move to USECASE
             */
            const presenter = new ListSourceDataPresenter(params.response);  // will be injected

            const sourceDataGateway = serverContainer.get<KernelSourceDataGateway>(GATEWAYS.KERNEL_SOURCE_DATA_GATEWAY);  // will be injected

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
            const presenter = new ListSourceDataPresenter(params.response);
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
