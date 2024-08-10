/* eslint-disable @typescript-eslint/no-unused-vars */
import "reflect-metadata";

import { Container, type interfaces } from "inversify";
import { TSignal } from "~/lib/core/entity/signals";
import { SIGNAL_FACTORY } from "./client-ioc-symbols";
import type { TFileUploadingViewModel } from "~/lib/core/view-models/file-upload-view-model";
import { type TFileDownloadViewModel } from "~/lib/core/view-models/file-download-view-model";

const signalsContainer = new Container();

signalsContainer.bind<interfaces.Factory<TSignal<TFileUploadingViewModel>>>(SIGNAL_FACTORY.KERNEL_FILE_UPLOAD).toFactory<TSignal<TFileUploadingViewModel>, [update: (value: TFileUploadingViewModel) => void, TFileUploadingViewModel]>((context: interfaces.Context) => 
  (update: (value: TFileUploadingViewModel) => void, initialValue: TFileUploadingViewModel) => {
    return new TSignal<TFileUploadingViewModel>(
      "KernelFileUpload",
      "Display the status of a File Upload feature",
      initialValue,
      update,
    )}
);

signalsContainer.bind<interfaces.Factory<TSignal<TFileDownloadViewModel>>>(SIGNAL_FACTORY.KERNEL_FILE_DOWNLOAD).toFactory<TSignal<TFileDownloadViewModel>, [update: (value: TFileDownloadViewModel) => void, TFileDownloadViewModel]>((context: interfaces.Context) =>
  (update: (value: TFileDownloadViewModel) => void, initialValue: TFileDownloadViewModel) => {
    return new TSignal<TFileDownloadViewModel>(
      "KernelFileDownload",
      "Display the status of a File Download feature",
      initialValue,
      update,
    )}
);

export default signalsContainer;