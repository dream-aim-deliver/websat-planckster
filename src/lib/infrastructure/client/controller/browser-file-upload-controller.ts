import { injectable } from "inversify";
import clientContainer from "../config/ioc/client-container";
import { USECASE_FACTORY } from "../config/ioc/client-ioc-symbols";
import { TFileUploadViewModel } from "~/lib/core/view-models/file-upload-view-model";
import { Signal } from "~/lib/core/entity/signals";
import { LocalFile } from "~/lib/core/entity/file";
import { FileUploadInputPort } from "~/lib/core/ports/primary/file-upload-primary-ports";
import { TFileUploadRequest } from "~/lib/core/usecase-models/file-upload-usecase-models";

export interface TBrowserFileUploadControllerParameters {
  response: Signal<TFileUploadViewModel>;
  file: File;
}

@injectable()
export default class BrowserFileUploadController {
  async execute(controllerParameters: TBrowserFileUploadControllerParameters): Promise<void> {
    const { response, file } = controllerParameters;

    const localFile: LocalFile = {
      type: "local",
      raw: file,
      relativePath: file.name,
      name: file.name,
    };

    const request: TFileUploadRequest = {
      status: "request",
      file: localFile,
    };

    const usecaseFactory = clientContainer.get<(response: Signal<TFileUploadViewModel>) => FileUploadInputPort>(USECASE_FACTORY.FILE_UPLOAD);
    const usecase = usecaseFactory(response);
    await usecase.execute(request);
  }
}
