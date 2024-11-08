import signalsContainer from "~/lib/infrastructure/common/signals-container";
import type { TListSourceDataViewModel } from "~/lib/core/view-models/list-source-data-view-models";
import type { Signal } from "~/lib/core/entity/signals";
import { SIGNAL_FACTORY } from "~/lib/infrastructure/common/signals-ioc-container";
import clientContainer from "~/lib/infrastructure/client/config/ioc/client-container";
import { CONTROLLERS } from "~/lib/infrastructure/client/config/ioc/client-ioc-symbols";
import type { TFileDownloadViewModel } from "~/lib/core/view-models/file-download-view-model";
import type { TFileUploadViewModel } from "~/lib/core/view-models/file-upload-view-model";
import { Dispatch, SetStateAction } from "react";
import BrowserListSourceDataController, { TBrowserListSourceDataControllerParameters } from "~/lib/infrastructure/client/controller/browser-list-source-data-controller";
import BrowserFileDownloadController, { TBrowserFileDownloadControllerParameters } from "~/lib/infrastructure/client/controller/browser-file-download-controller";
import BrowserFileUploadController, { TBrowserFileUploadControllerParameters } from "~/lib/infrastructure/client/controller/browser-file-upload-controller";

const querySources = (setListSourceDataViewModel: Dispatch<SetStateAction<TListSourceDataViewModel>>, researchContextID?: number) => async () => {
  const signalFactory = signalsContainer.get<(initialValue: TListSourceDataViewModel, update?: (value: TListSourceDataViewModel) => void) => Signal<TListSourceDataViewModel>>(SIGNAL_FACTORY.KERNEL_LIST_SOURCE_DATA);
  const response: Signal<TListSourceDataViewModel> = signalFactory(
    {
      status: "request",
    },
    setListSourceDataViewModel,
  );
  const controllerParameters: TBrowserListSourceDataControllerParameters = {
    response: response,
    researchContextID: researchContextID,
  };
  const controller = clientContainer.get<BrowserListSourceDataController>(CONTROLLERS.LIST_SOURCE_DATA_CONTROLLER);
  await controller.execute(controllerParameters);
  return response;
};

type DownloadSourceMutationParams = {
  relativePath: string;
  sourceFilename: string;
};

const downloadSourceMutation = (setDownloadSourceDataViewModel: Dispatch<SetStateAction<TFileDownloadViewModel>>) => async (params: DownloadSourceMutationParams) => {
  const signalFactory = signalsContainer.get<(initialValue: TFileDownloadViewModel, update?: (value: TFileDownloadViewModel) => void) => Signal<TFileDownloadViewModel>>(SIGNAL_FACTORY.KERNEL_FILE_DOWNLOAD);
  const response: Signal<TFileDownloadViewModel> = signalFactory(
    {
      status: "request",
    } as TFileDownloadViewModel,
    setDownloadSourceDataViewModel,
  );
  const controllerParameters: TBrowserFileDownloadControllerParameters = {
    response: response,
    relativePath: params.relativePath,
    localPath: params.sourceFilename,
  };
  const controller = clientContainer.get<BrowserFileDownloadController>(CONTROLLERS.KERNEL_FILE_DOWNLOAD_CONTROLLER);
  await controller.execute(controllerParameters);
  return response;
};

type UploadSourceMutationParams = {
  file: File;
  clientID: string;
};

const uploadSourceMutation = (setUploadSourceDataViewModel: Dispatch<SetStateAction<TFileUploadViewModel>>) => async (params: UploadSourceMutationParams) => {
  const signalFactory = signalsContainer.get<(initialValue: TFileUploadViewModel, update?: (value: TFileUploadViewModel) => void) => Signal<TFileUploadViewModel>>(SIGNAL_FACTORY.KERNEL_FILE_UPLOAD);
  const response: Signal<TFileUploadViewModel> = signalFactory(
    {
      status: "request",
    } as TFileUploadViewModel,
    setUploadSourceDataViewModel,
  );
  const controllerParameters: TBrowserFileUploadControllerParameters = {
    response: response,
    file: params.file,
    clientID: params.clientID,
  };
  const controller = clientContainer.get<BrowserFileUploadController>(CONTROLLERS.KERNEL_FILE_UPLOAD_CONTROLLER);
  await controller.execute(controllerParameters);
  return response;
};

export { querySources, downloadSourceMutation, uploadSourceMutation };
