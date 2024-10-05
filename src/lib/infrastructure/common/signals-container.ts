/* eslint-disable @typescript-eslint/no-unused-vars */
import "reflect-metadata";

import { Container, type interfaces } from "inversify";
import { Signal } from "~/lib/core/entity/signals";
import type { TFileUploadViewModel } from "~/lib/core/view-models/file-upload-view-model";
import { type TFileDownloadViewModel } from "~/lib/core/view-models/file-download-view-model";
import type { TListConversationsViewModel } from "~/lib/core/view-models/list-conversations-view-model";
import { SIGNAL_FACTORY } from "./signals-ioc-container";
import { type TCreateConversationViewModel } from "~/lib/core/view-models/create-conversation-view-model";
import { type TListMessagesForConversationViewModel } from "~/lib/core/view-models/list-messages-for-conversation-view-model";
import { type TListSourceDataViewModel } from "~/lib/core/view-models/list-source-data-view-models";
import type { TListResearchContextsViewModel } from "~/lib/core/view-models/list-research-contexts-view-models";
import type { TCreateResearchContextViewModel } from "~/lib/core/view-models/create-research-context-view-models";
import { type TSendMessageToConversationViewModel } from "~/lib/core/view-models/send-message-to-conversation-view-model";

const signalsContainer = new Container();

signalsContainer
  .bind<interfaces.Factory<Signal<TCreateResearchContextViewModel>>>(SIGNAL_FACTORY.CREATE_RESEARCH_CONTEXT)
  .toFactory<Signal<TCreateResearchContextViewModel>, [TCreateResearchContextViewModel, (value: TCreateResearchContextViewModel) => void]>((context: interfaces.Context) => (initialValue: TCreateResearchContextViewModel, update?: (value: TCreateResearchContextViewModel) => void) => {
    return new Signal<TCreateResearchContextViewModel>("CreateResearchContext", "Display the status of a Create Research Context feature", initialValue, update);
  });


signalsContainer
  .bind<interfaces.Factory<Signal<TFileUploadViewModel>>>(SIGNAL_FACTORY.KERNEL_FILE_UPLOAD)
  .toFactory<Signal<TFileUploadViewModel>, [TFileUploadViewModel, (value: TFileUploadViewModel) => void]>((context: interfaces.Context) => (initialValue: TFileUploadViewModel, update?: (value: TFileUploadViewModel) => void) => {
    return new Signal<TFileUploadViewModel>("KernelFileUpload", "Display the status of a File Upload feature", initialValue, update);
  });

signalsContainer
  .bind<interfaces.Factory<Signal<TFileDownloadViewModel>>>(SIGNAL_FACTORY.KERNEL_FILE_DOWNLOAD)
  .toFactory<Signal<TFileDownloadViewModel>, [TFileDownloadViewModel, (value: TFileDownloadViewModel) => void]>((context: interfaces.Context) => (initialValue: TFileDownloadViewModel, update?: (value: TFileDownloadViewModel) => void) => {
    return new Signal<TFileDownloadViewModel>("KernelFileDownload", "Display the status of a File Download feature", initialValue, update);
  });

signalsContainer
  .bind<interfaces.Factory<Signal<TListConversationsViewModel>>>(SIGNAL_FACTORY.KERNEL_LIST_CONVERSATIONS)
  .toFactory<
    Signal<TListConversationsViewModel>,
    [TListConversationsViewModel, (value: TListConversationsViewModel) => void]
  >((context: interfaces.Context) => (initialValue: TListConversationsViewModel, update?: (value: TListConversationsViewModel) => void) => {
    return new Signal<TListConversationsViewModel>("KernelListConversations", "Display the status of the List Conversations feature", initialValue, update);
  });

signalsContainer
  .bind<interfaces.Factory<Signal<TCreateConversationViewModel>>>(SIGNAL_FACTORY.KERNEL_CREATE_CONVERSATION)
  .toFactory<
    Signal<TCreateConversationViewModel>,
    [TCreateConversationViewModel, (value: TCreateConversationViewModel) => void]
  >((context: interfaces.Context) => (initialValue: TCreateConversationViewModel, update?: (value: TCreateConversationViewModel) => void) => {
    return new Signal<TCreateConversationViewModel>("KernelCreateConversation", "Display the status of the Create Conversation feature", initialValue, update);
  });

signalsContainer
  .bind<interfaces.Factory<Signal<TListMessagesForConversationViewModel>>>(SIGNAL_FACTORY.KERNEL_LIST_MESSAGES_FOR_CONVERSATION)
  .toFactory<
    Signal<TListMessagesForConversationViewModel>,
    [TListMessagesForConversationViewModel, (value: TListMessagesForConversationViewModel) => void]
  >((context: interfaces.Context) => (initialValue: TListMessagesForConversationViewModel, update?: (value: TListMessagesForConversationViewModel) => void) => {
    return new Signal<TListMessagesForConversationViewModel>("KernelListMessagesForConversation", "Display the status of the List Messages for Conversation feature", initialValue, update);
  });

signalsContainer
  .bind<interfaces.Factory<Signal<TListSourceDataViewModel>>>(SIGNAL_FACTORY.KERNEL_LIST_SOURCE_DATA)
  .toFactory<Signal<TListSourceDataViewModel>, [TListSourceDataViewModel, (value: TListSourceDataViewModel) => void]>((context: interfaces.Context) => (initialValue: TListSourceDataViewModel, update?: (value: TListSourceDataViewModel) => void) => {
    return new Signal<TListSourceDataViewModel>("KernelListSourceData", "Display the status of the List Source Data feature", initialValue, update);
  });

signalsContainer
  .bind<interfaces.Factory<Signal<TListResearchContextsViewModel>>>(SIGNAL_FACTORY.KERNEL_LIST_RESEARCH_CONTEXTS)
  .toFactory<Signal<TListResearchContextsViewModel>, [TListResearchContextsViewModel, (value: TListResearchContextsViewModel) => void]>((context: interfaces.Context) => (initialValue: TListResearchContextsViewModel, update?: (value: TListResearchContextsViewModel) => void) => {
    return new Signal<TListResearchContextsViewModel>("KernelListResearchContexts", "Display the status of the List Research Contexts feature", initialValue, update);
  });

signalsContainer
  .bind<interfaces.Factory<Signal<TSendMessageToConversationViewModel>>>(SIGNAL_FACTORY.SEND_MESSAGE_TO_CONVERSATION)
  .toFactory<Signal<TSendMessageToConversationViewModel>, [TSendMessageToConversationViewModel, (value: TSendMessageToConversationViewModel) => void]>((context: interfaces.Context) => (initialValue: TSendMessageToConversationViewModel, update?: (value: TSendMessageToConversationViewModel) => void) => {
    return new Signal<TSendMessageToConversationViewModel>("SendMessageToConversation", "Display the status of the Send Message to Conversation feature", initialValue, update);
  });

export default signalsContainer;
