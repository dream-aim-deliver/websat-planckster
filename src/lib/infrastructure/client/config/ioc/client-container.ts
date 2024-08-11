/* eslint-disable @typescript-eslint/no-unused-vars */
import "reflect-metadata";
import { Container, type interfaces } from "inversify";
import { CONTROLLERS, REPOSITORY, TRPC, UTILS } from "./client-ioc-symbols";
import { api } from "~/lib/infrastructure/client/trpc/react-api";
import { api as vanilla } from "~/lib/infrastructure/client/trpc/vanilla-api";
import KernelFileClientRepository from "../../repository/kernel-remote-storage-element";
import BrowserFileUploadController from "../../controller/browser-file-upload-controller";
import config from "./log/tslog-browser-config";
import { Logger } from "tslog";
import BrowserFileDownloadController from "../../controller/browser-file-download-controller";
import BrowserSourceDataRepository from "../../repository/browser-source-data-repository";
import CreateResearchContextBrowserController from "../../controller/browser-create-research-context-controller";
import BrowserResearchContextRepository from "../../repository/browser-research-context-repository";
import BrowserCreateConversationController from "../../controller/browser-create-conversation-controller";
import BrowserListConversationsController from "../../controller/browser-list-conversations-controller";
import BrowserListMessagesForConversationController from "../../controller/browser-list-messages-for-conversation-controller";
import BrowserListResearchContextsController from "../../controller/browser-list-research-contexts-controller";
import BrowserListSourceDataController from "../../controller/browser-list-source-data-controller";
import BrowserSendMessageToConversationController from "../../controller/browser-send-message-to-conversation-controller";

const clientContainer = new Container();

/** Aspect: Logging */
clientContainer.bind<interfaces.Factory<Logger<unknown>>>(UTILS.LOGGER_FACTORY).toFactory<Logger<unknown>, [string]>((context: interfaces.Context) =>
    (module: string) => {
        const logger = new Logger<unknown>({
            ...config,
            name: module,
        });
        return logger;
    }
);

/** TRPC */
clientContainer.bind(TRPC.REACT_CLIENT_COMPONENTS_API).toConstantValue(api);
clientContainer.bind(TRPC.VANILLA_CLIENT).toConstantValue(vanilla);

/** REPOSITORY */
clientContainer.bind(REPOSITORY.KERNEL_FILE_REPOSITORY).to(KernelFileClientRepository).inSingletonScope();
clientContainer.bind(REPOSITORY.BROWSER_SOURCE_DATA_REPOSITORY).to(BrowserSourceDataRepository).inSingletonScope();
clientContainer.bind(REPOSITORY.BROWSER_RESEARCH_CONTEXT_REPOSITORY).to(BrowserResearchContextRepository).inSingletonScope();

/** CONTROLLER */
clientContainer.bind(CONTROLLERS.KERNEL_FILE_UPLOAD_CONTROLLER).to(BrowserFileUploadController);
clientContainer.bind(CONTROLLERS.KERNEL_FILE_DOWNLOAD_CONTROLLER).to(BrowserFileDownloadController);
clientContainer.bind(CONTROLLERS.CREATE_CONVERSATION_CONTROLLER).to(BrowserCreateConversationController);
clientContainer.bind(CONTROLLERS.CREATE_RESEARCH_CONTEXT_CONTROLLER).to(CreateResearchContextBrowserController);
clientContainer.bind(CONTROLLERS.LIST_CONVERSATIONS_CONTROLLER).to(BrowserListConversationsController);
clientContainer.bind(CONTROLLERS.LIST_MESSAGES_FOR_CONVERSATION_CONTROLLER).to(BrowserListMessagesForConversationController);
clientContainer.bind(CONTROLLERS.LIST_RESEARCH_CONTEXTS_CONTROLLER).to(BrowserListResearchContextsController);
clientContainer.bind(CONTROLLERS.LIST_SOURCE_DATA_CONTROLLER).to(BrowserListSourceDataController);
clientContainer.bind(CONTROLLERS.SEND_MESSAGE_TO_CONVERSATION_CONTROLLER).to(BrowserSendMessageToConversationController);

export default clientContainer;