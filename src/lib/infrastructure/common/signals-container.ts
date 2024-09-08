/* eslint-disable @typescript-eslint/no-unused-vars */
import "reflect-metadata";

import { Container, type interfaces } from "inversify";
import { Signal } from "~/lib/core/entity/signals";
import type { TFileUploadingViewModel } from "~/lib/core/view-models/file-upload-view-model";
import { type TFileDownloadViewModel } from "~/lib/core/view-models/file-download-view-model";
import type { TListConversationsViewModel } from "~/lib/core/view-models/list-conversations-view-model";
import { SIGNAL_FACTORY } from "./signals-ioc-container";
import { type TCreateConversationViewModel } from "~/lib/core/view-models/create-conversation-view-model";

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

signalsContainer.bind<interfaces.Factory<Signal<TListConversationsViewModel>>>(SIGNAL_FACTORY.KERNEL_LIST_CONVERSATIONS).toFactory<Signal<TListConversationsViewModel>, [TListConversationsViewModel, (value: TListConversationsViewModel) => void]>((context: interfaces.Context) =>
  (initialValue: TListConversationsViewModel, update?: (value: TListConversationsViewModel) => void) => {
    return new Signal<TListConversationsViewModel>(
      "KernelListConversations",
      "Display the status of the List Conversations feature",
      initialValue,
      update,
    )}
);

signalsContainer.bind<interfaces.Factory<Signal<TCreateConversationViewModel>>>(SIGNAL_FACTORY.KERNEL_CREATE_CONVERSATION).toFactory<Signal<TCreateConversationViewModel>, [TCreateConversationViewModel, (value: TCreateConversationViewModel) => void]>((context: interfaces.Context) =>
  (initialValue: TCreateConversationViewModel, update?: (value: TCreateConversationViewModel) => void) => {
    return new Signal<TCreateConversationViewModel>(
      "KernelCreateConversation",
      "Display the status of the Create Conversation feature",
      initialValue,
      update,
    )}
);


export default signalsContainer;