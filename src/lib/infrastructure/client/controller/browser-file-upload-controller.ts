import { injectable } from "inversify";
import clientContainer from "../config/ioc/client-container";
import { REPOSITORY, TRPC } from "../config/ioc/client-ioc-symbols";
import BrowserFileUploadPresenter from "../presenter/browser-file-upload-presenter";
import type KernelFileClientRepository from "../repository/kernel-remote-storage-element";
import { TFileUploadingViewModel } from "~/lib/core/view-models/file-upload-view-model";
import { TSignal } from "~/lib/core/entity/signals";
import { LocalFile, RemoteFile } from "~/lib/core/entity/file";
import { TVanillaAPI } from "../trpc/vanilla-api";

export interface TBrowserFileUploadControllerParameters {
  file: File;
  response: TSignal<TFileUploadingViewModel>;
}

@injectable()
export default class BrowserFileUploadController {
  // TODO: this should create the source data too, not just upload the file

  async execute(
    controllerParameters: TBrowserFileUploadControllerParameters,
  ): Promise<void> {
    const { file } = controllerParameters;
    const fileName = file.name;
    const localFile: LocalFile = {
      type: "local",
      raw: file,
      path: file.name,
      name: file.name,
    };
    /************************************************************/
    /* TODO: move to USECASE */
    /************************************************************/
    const presenter = new BrowserFileUploadPresenter(
      controllerParameters.response,
    );
    const kernelFileRepository =  clientContainer.get<KernelFileClientRepository>(REPOSITORY.KERNEL_FILE_REPOSITORY); // would be injected
    const api = clientContainer.get<TVanillaAPI>(TRPC.VANILLA_CLIENT);

    presenter.presentProgress({
      message: `Uploading file ${file.name} to the storage server...`,
      progress: 0,
    });
    const dto = await kernelFileRepository.uploadFile(localFile);

    if (!dto.success) {
      presenter.presentError({
        message: `An error occurred: ${dto.data.message}`,
      });
      return;
    } else {
      presenter.presentProgress({
        message: `File ${file.name} uploaded successfully to ${dto.data.provider}`,
        progress: 50,
      });
    }

    // register the file in the source data
    const remoteFile: RemoteFile = dto.data;
    const CreateSourceDataDTO = await api.kernel.sourceData.create.mutate({
      relativePath: remoteFile.path,
      sourceDataName: fileName,
      protocol: "s3",
    });
    if (CreateSourceDataDTO.success) {
      const data = CreateSourceDataDTO.data;
      presenter.presentSuccess({
        message: `Source data created successfully at ${data.protocol}://${data.relative_path}/${fileName}`,
        fileName: `${remoteFile.path}`,
      });
      return;
    }
    presenter.presentError({
      message: `An error occurred: ${CreateSourceDataDTO.data.message}`,
    });
  }
}
