import { injectable } from "inversify";
import clientContainer from "../config/ioc/client-container";
import { Signal } from "~/lib/core/entity/signals";
import { TFileDownloadViewModel } from "~/lib/core/view-models/file-download-view-model";
import { USECASE_FACTORY } from "../config/ioc/client-ioc-symbols";
import { TFileDownloadRequest } from "~/lib/core/usecase-models/file-download-usecase-models";
import { FileDownloadInputPort } from "~/lib/core/ports/primary/file-download-primary-ports";

export interface TBrowserFileDownloadControllerParameters {
  response: Signal<TFileDownloadViewModel>;
  relativePath: string;
  localPath?: string;
}

@injectable()
export default class BrowserFileDownloadController {
  async execute(controllerParameters: TBrowserFileDownloadControllerParameters): Promise<void> {
    const { response, relativePath, localPath } = controllerParameters;

    const request: TFileDownloadRequest = {
      status: "request",
      relativePath: relativePath,
      localPath: localPath,
    };

    const usecaseFactory = clientContainer.get<(response: Signal<TFileDownloadViewModel>) => FileDownloadInputPort>(USECASE_FACTORY.FILE_DOWNLOAD);
    const usecase = usecaseFactory(response);
    await usecase.execute(request);
  }
}
