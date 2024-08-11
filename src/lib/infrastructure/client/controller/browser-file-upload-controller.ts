import { injectable } from "inversify";
import clientContainer from "../config/ioc/client-container";
import { GATEWAYS } from "../config/ioc/client-ioc-symbols";
import BrowserFileUploadPresenter from "../presenter/browser-file-upload-presenter";
import { TFileUploadingViewModel } from "~/lib/core/view-models/file-upload-view-model";
import { TSignal } from "~/lib/core/entity/signals";
import { LocalFile, RemoteFile } from "~/lib/core/entity/file";
import BrowserSourceDataGateway from "../gateway/browser-source-data-gateway";

export interface TBrowserFileUploadControllerParameters {
  file: File;
  response: TSignal<TFileUploadingViewModel>;
}

@injectable()
export default class BrowserFileUploadController {

  async execute(
    controllerParameters: TBrowserFileUploadControllerParameters,
  ): Promise<void> {
    const { file } = controllerParameters;
    const fileName = file.name;
    const localFile: LocalFile = {
      type: "local",
      raw: file,
      relativePath: file.name,
      name: file.name,
    };
    /************************************************************/
    /* TODO: move to USECASE */
    /************************************************************/
    const presenter = new BrowserFileUploadPresenter(
      controllerParameters.response,
    );

    const sourceDataGateway = clientContainer.get<BrowserSourceDataGateway>(GATEWAYS.SOURCE_DATA_GATEWAY); // would be injected

    presenter.presentProgress({
      message: `Uploading file ${file.name} to the storage server...`,
      progress: 0,
    });


    const relativePath = `user-uploads/${fileName}`;

    const dto = await sourceDataGateway.upload(localFile, relativePath);

    if (!dto.success) {
      presenter.presentError({
        message: `An error occurred while uploading file ${file.name}: ${dto.data.message}`,
      });
      return;
    }

    const remoteFile: RemoteFile = dto.data;

    presenter.presentSuccess({
      message: `File ${file.name} uploaded successfully to ${remoteFile.provider}`,
      fileName: remoteFile.name,
    });

  }

}
