import { z } from "zod";
import { injectable } from "inversify";
import clientContainer from "../config/ioc/client-container";
import { TSignal } from "~/lib/core/entity/signals";
import { TFileDownloadViewModel } from "~/lib/core/view-models/file-download-view-model";
import BrowserFileDownloadPresenter from "../presenter/browser-file-download-presenter";
import { GATEWAYS } from "../config/ioc/client-ioc-symbols";
import { RemoteFile } from "~/lib/core/entity/file";
import path from "path";
import BrowserSourceDataGateway from "../gateway/browser-source-data-gateway";


/**
 * Represents the basic information of a source data object.
 * This information is displayed to the user and can be retrieved from the front.
 */
export const SourceDataBasicInformationSchema = z.object({
    id: z.string(),
    name: z.string(),
    relativePath: z.string(),
    createdAt: z.string(),
});

export type TSourceDataBasicInformation = z.infer<typeof SourceDataBasicInformationSchema>;


export interface TBrowserFileDownloadControllerParameters {
    sourceDataBasicInformationList: TSourceDataBasicInformation[];
    response: TSignal<TFileDownloadViewModel>;
}

@injectable()
export default class BrowserFileDownloadController {

    async execute(
        controllerParameters: TBrowserFileDownloadControllerParameters,
    ): Promise<void> {

        try {
            const { sourceDataBasicInformationList } = controllerParameters;
            // Craft the remote file objects
            const remoteFiles: RemoteFile[] = sourceDataBasicInformationList.map((sourceDataBasicInformation) => {
                return {
                    type: "remote",
                    id: sourceDataBasicInformation.id,
                    name: sourceDataBasicInformation.name,
                    relativePath: sourceDataBasicInformation.relativePath,
                    createdAt: sourceDataBasicInformation.createdAt,
                    provider: "kernel#s3",
                };
            }
            );

            const amountOfFiles = remoteFiles.length;


            /************************************************************/
            /* TODO: move to USECASE */
            /************************************************************/
            const presenter = new BrowserFileDownloadPresenter(
                controllerParameters.response,
            );

            const sourceDataGateway = clientContainer.get<BrowserSourceDataGateway>(
                GATEWAYS.SOURCE_DATA_GATEWAY
            ); // would be injected


            let progress = 0;
            const unsuccessfullFileNames: string[] = [];

            presenter.presentProgress({
                message: `Downloading selected files from the storage server...`,
                progress: progress,
            });

            // Loop through the files and download them
            for (const file of remoteFiles) {
                progress += 100 / amountOfFiles;
                
                const fileBaseName = path.basename(file.relativePath);

                const dto = await sourceDataGateway.download(file, fileBaseName);

                if (!dto.success) {
                    presenter.presentProgress({
                        message: `An error occurred while downloading file '${file.relativePath}': ${dto.data.message}`,
                        progress: progress,
                    });

                    // TODO: might be better to do proper logging here
                    console.log(`An error occurred while downloading file '${file.relativePath}': ${dto.data.message}`);
                    
                    unsuccessfullFileNames.push(file.relativePath);

                } else {
                    presenter.presentProgress({
                        message: `File ${file.relativePath} downloaded successfully`,
                        progress: progress,
                    });
                }
            }

            // Check if all files were downloaded successfully
            const successDifference = amountOfFiles - unsuccessfullFileNames.length;

            // Depending on the amount of files that were downloaded successfully, present the appropriate view model
            switch (successDifference) {
                case amountOfFiles:
                    presenter.presentSuccess({
                        message: `All files downloaded successfully`,
                    });
                    break;
                case 0:
                    presenter.presentError({
                        message: `Error: none of the files were downloaded successfully`,
                    });
                    break;
                default:
                    presenter.presentPartial({
                        message: `Some files were not downloaded successfully`,
                        unsuccessfullFileNames: unsuccessfullFileNames,
                    });
                    break;
            }

            return;

        } catch (error: unknown) {
            const err = error as Error;
            const presenter = new BrowserFileDownloadPresenter(
                controllerParameters.response,
            );
            presenter.presentError({
                message: `An error occurred: ${err.message}`,
            });
            return;
        }
    }
}