/* eslint-disable @typescript-eslint/no-unused-vars */
import "reflect-metadata";

import { Container, type interfaces } from "inversify";
import { Signal } from "~/lib/core/entity/signals";
import { SIGNAL_FACTORY } from "./client-ioc-symbols";
import type { TFileUploadingViewModel } from "~/lib/core/view-models/file-upload-view-model";
import { type TFileDownloadViewModel } from "~/lib/core/view-models/file-download-view-model";
import { TListConversationsViewModel } from "~/lib/core/view-models/list-conversations-view-model";

const signalsContainer = new Container();

signalsContainer.bind<interfaces.Factory<Signal<TFileUploadingViewModel>>>(SIGNAL_FACTORY.KERNEL_FILE_UPLOAD).toFactory<Signal<TFileUploadingViewModel>, [update: (value: TFileUploadingViewModel) => void, TFileUploadingViewModel]>((context: interfaces.Context) => 
  (update: (value: TFileUploadingViewModel) => void, initialValue: TFileUploadingViewModel) => {
    return new Signal<TFileUploadingViewModel>(
      "KernelFileUpload",
      "Display the status of a File Upload feature",
      initialValue,
      update,
    )}
);

signalsContainer.bind<interfaces.Factory<Signal<TFileDownloadViewModel>>>(SIGNAL_FACTORY.KERNEL_FILE_DOWNLOAD).toFactory<Signal<TFileDownloadViewModel>, [update: (value: TFileDownloadViewModel) => void, TFileDownloadViewModel]>((context: interfaces.Context) =>
  (update: (value: TFileDownloadViewModel) => void, initialValue: TFileDownloadViewModel) => {
    return new Signal<TFileDownloadViewModel>(
      "KernelFileDownload",
      "Display the status of a File Download feature",
      initialValue,
      update,
    )}
);

signalsContainer.bind<interfaces.Factory<Signal<TListConversationsViewModel>>>(SIGNAL_FACTORY.KERNEL_LIST_CONVERSATIONS).toFactory<Signal<TListConversationsViewModel>, [update: (value: TListConversationsViewModel) => void, TListConversationsViewModel]>((context: interfaces.Context) =>
  (update: (value: TListConversationsViewModel) => void, initialValue: TListConversationsViewModel) => {
    return new Signal<TListConversationsViewModel>(
      "KernelListConversations",
      "Display the status of the List Conversations feature",
      initialValue,
      update,
    )}
);


export default signalsContainer;