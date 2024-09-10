/* eslint-disable @typescript-eslint/no-unused-vars */
import "reflect-metadata";
import { Container, type interfaces } from "inversify";
import { CONTROLLERS, GATEWAYS, TRPC, USECASE_FACTORY, UTILS } from "./client-ioc-symbols";
import { api } from "~/lib/infrastructure/client/trpc/react-api";
import { api as vanilla } from "~/lib/infrastructure/client/trpc/vanilla-api";
import BrowserFileUploadController from "../../controller/browser-file-upload-controller";
import config from "./log/tslog-browser-config";
import { type ILogObj, Logger } from "tslog";
import BrowserFileDownloadController from "../../controller/browser-file-download-controller";
import BrowserKernelSourceDataGateway from "../../gateway/browser-source-data-gateway";
import CreateResearchContextBrowserController from "../../controller/browser-create-research-context-controller";
import BrowserCreateConversationController from "../../controller/browser-create-conversation-controller";
import BrowserListConversationsController from "../../controller/browser-list-conversations-controller";
import BrowserListMessagesForConversationController from "../../controller/browser-list-messages-for-conversation-controller";
import BrowserListResearchContextsController from "../../controller/browser-list-research-contexts-controller";
import BrowserListSourceDataController from "../../controller/browser-list-source-data-controller";
import BrowserSendMessageToConversationController from "../../controller/browser-send-message-to-conversation-controller";
import BrowserAgentGateway from "../../gateway/browser-agent-gateway";
import BrowserResearchContextGateway from "../../gateway/browser-research-context-gateway";
import { type CreateResearchContextInputPort } from "~/lib/core/ports/primary/create-research-context-primary-ports";
import { type Signal } from "~/lib/core/entity/signals";
import { type TCreateResearchContextViewModel } from "~/lib/core/view-models/create-research-context-view-models";
import BrowserCreateResearchContextPresenter from "../../presenter/browser-create-research-context-presenter";
import type AgentGatewayOutputPort from "~/lib/core/ports/secondary/agent-gateway-output-port";
import type VectorStoreOutputPort from "~/lib/core/ports/secondary/vector-store-output-port";
import CreateResearchContextUsecase from "~/lib/core/usecase/create-research-context-usecase";
import type ResearchContextGatewayOutputPort from "~/lib/core/ports/secondary/research-context-gateway-output-port";
import BrowserVectorStoreGateway from "../../gateway/browser-vector-store-gateway";
import type { SendMessageToConversationInputPort } from "~/lib/core/ports/primary/send-message-to-conversation-primary-ports";
import { type TSendMessageToConversationViewModel } from "~/lib/core/view-models/send-message-to-conversation-view-model";
import BrowserSendMessageToConversationUseCase from "~/lib/core/usecase/send-message-to-conversation-usecase";
import BrowserSendMessageToConversationPresenter from "../../presenter/browser-send-message-to-conversation-presenter";
import type ConversationGatewayOutputPort from "~/lib/core/ports/secondary/conversation-gateway-output-port";
import { type FileUploadInputPort } from "~/lib/core/ports/primary/file-upload-primary-ports";
import { type TFileUploadViewModel } from "~/lib/core/view-models/file-upload-view-model";
import { type TFileDownloadViewModel } from "~/lib/core/view-models/file-download-view-model";
import BrowserFileUploadPresenter from "../../presenter/browser-file-upload-presenter";
import FileUploadUsecase from "~/lib/core/usecase/file-upload-usecase";
import { type FileDownloadInputPort } from "~/lib/core/ports/primary/file-download-primary-ports";
import FileDownloadUsecase from "~/lib/core/usecase/file-download-usecase";
import BrowserFileDownloadPresenter from "../../presenter/browser-file-download-presenter";
import { type ListResearchContextsInputPort } from "~/lib/core/ports/primary/list-research-contexts-primary-ports";
import { type TListResearchContextsViewModel } from "~/lib/core/view-models/list-research-contexts-view-models";
import BrowserListResearchContextsPresenter from "../../presenter/browser-list-research-contexts-presenter";
import ListResearchContextsUsecase from "~/lib/core/usecase/list-research-contexts-usecase";

const clientContainer = new Container();

/** Aspect: Logging */
clientContainer.bind<interfaces.Factory<Logger<unknown>>>(UTILS.LOGGER_FACTORY).toFactory<Logger<unknown>, [string]>((context: interfaces.Context) => (module: string) => {
  const logger = new Logger<unknown>({
    ...config,
    name: module,
  });
  return logger;
});

/** TRPC */
clientContainer.bind(TRPC.REACT_CLIENT_COMPONENTS_API).toConstantValue(api);
clientContainer.bind(TRPC.VANILLA_CLIENT).toConstantValue(vanilla);

/** REPOSITORY */

/** GATEWAYS */
clientContainer.bind(GATEWAYS.AGENT_GATEWAY).to(BrowserAgentGateway).inSingletonScope();
clientContainer.bind(GATEWAYS.RESEARCH_CONTEXT_GATEWAY).to(BrowserResearchContextGateway).inSingletonScope();
clientContainer.bind(GATEWAYS.VECTOR_STORE_GATEWAY).to(BrowserVectorStoreGateway).inSingletonScope();

clientContainer.bind(GATEWAYS.KERNEL_SOURCE_DATA_GATEWAY).to(BrowserKernelSourceDataGateway).inSingletonScope();

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

/** USECASE FACTORY */
/* eslint-disable  */
clientContainer
  .bind<interfaces.Factory<CreateResearchContextInputPort>>(USECASE_FACTORY.CREATE_RESEARCH_CONTEXT)
  .toFactory<CreateResearchContextInputPort, [Signal<TCreateResearchContextViewModel>]>((context: interfaces.Context) => (response: Signal<TCreateResearchContextViewModel>) => {
    const presenter = new BrowserCreateResearchContextPresenter(response);
    const agentGateway = context.container.get<AgentGatewayOutputPort<any>>(GATEWAYS.AGENT_GATEWAY);
    const researchContextGateway = context.container.get<ResearchContextGatewayOutputPort>(GATEWAYS.RESEARCH_CONTEXT_GATEWAY);
    const vectorStore = context.container.get<VectorStoreOutputPort>(GATEWAYS.VECTOR_STORE_GATEWAY);
    const usecase = new CreateResearchContextUsecase(presenter, researchContextGateway, agentGateway, vectorStore);
    return usecase;
  });

clientContainer
  .bind<interfaces.Factory<SendMessageToConversationInputPort>>(USECASE_FACTORY.SEND_MESSAGE_TO_CONVERSATION)
  .toFactory<SendMessageToConversationInputPort, [Signal<TSendMessageToConversationViewModel>]>((context: interfaces.Context) => (response: Signal<TSendMessageToConversationViewModel>) => {
    const loggerFactory = context.container.get<(module: string) => Logger<ILogObj>>(UTILS.LOGGER_FACTORY);
    const presenter = new BrowserSendMessageToConversationPresenter(response, loggerFactory);
    const agentGateway = context.container.get<AgentGatewayOutputPort<any>>(GATEWAYS.AGENT_GATEWAY);
    const conversationGateway = context.container.get<ConversationGatewayOutputPort>(GATEWAYS.CONVERSATION_GATEWAY);
    const usecase = new BrowserSendMessageToConversationUseCase(presenter, agentGateway, conversationGateway);
    return usecase;
  });

clientContainer.bind<interfaces.Factory<FileUploadInputPort>>(USECASE_FACTORY.FILE_UPLOAD).toFactory<FileUploadInputPort, [Signal<TFileUploadViewModel>]>((context: interfaces.Context) => (response: Signal<TFileUploadViewModel>) => {
  const loggerFactory = context.container.get<(module: string) => Logger<ILogObj>>(UTILS.LOGGER_FACTORY);
  const presenter = new BrowserFileUploadPresenter(response, loggerFactory);
  const sourceDataGateway = context.container.get<BrowserKernelSourceDataGateway>(GATEWAYS.KERNEL_SOURCE_DATA_GATEWAY);
  const usecase = new FileUploadUsecase(presenter, sourceDataGateway);
  return usecase;
});

clientContainer.bind<interfaces.Factory<FileDownloadInputPort>>(USECASE_FACTORY.FILE_DOWNLOAD).toFactory<FileDownloadInputPort, [Signal<TFileDownloadViewModel>]>((context: interfaces.Context) => (response: Signal<TFileDownloadViewModel>) => {
  const loggerFactory = context.container.get<(module: string) => Logger<ILogObj>>(UTILS.LOGGER_FACTORY);
  const presenter = new BrowserFileDownloadPresenter(response, loggerFactory);
  const sourceDataGateway = context.container.get<BrowserKernelSourceDataGateway>(GATEWAYS.KERNEL_SOURCE_DATA_GATEWAY);
  const usecase = new FileDownloadUsecase(presenter, sourceDataGateway);
  return usecase;
});

clientContainer.bind<interfaces.Factory<ListResearchContextsInputPort>>(USECASE_FACTORY.LIST_RESEARCH_CONTEXTS).toFactory<ListResearchContextsInputPort, [Signal<TListResearchContextsViewModel>]>((context: interfaces.Context) => (response: Signal<TListResearchContextsViewModel>) => {
  const loggerFactory = context.container.get<(module: string) => Logger<ILogObj>>(UTILS.LOGGER_FACTORY);
  const presenter = new BrowserListResearchContextsPresenter(response, loggerFactory);
  const researchContextGateway = context.container.get<ResearchContextGatewayOutputPort>(GATEWAYS.RESEARCH_CONTEXT_GATEWAY);
  const usecase = new ListResearchContextsUsecase(presenter, researchContextGateway);
  return usecase;
}
);

/* eslint-enable  */

export default clientContainer;
