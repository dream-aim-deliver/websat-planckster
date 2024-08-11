/* eslint-disable @typescript-eslint/no-unused-vars */
import "reflect-metadata";
import { Container, type interfaces } from "inversify";
import { CONTROLLERS, GATEWAYS, TRPC, USECASE_FACTORY, UTILS } from "./client-ioc-symbols";
import { api } from "~/lib/infrastructure/client/trpc/react-api";
import { api as vanilla } from "~/lib/infrastructure/client/trpc/vanilla-api";
import BrowserFileUploadController from "../../controller/browser-file-upload-controller";
import config from "./log/tslog-browser-config";
import { Logger } from "tslog";
import BrowserFileDownloadController from "../../controller/browser-file-download-controller";
import BrowserSourceDataGateway from "../../gateway/browser-source-data-gateway";
import CreateResearchContextBrowserController from "../../controller/browser-create-research-context-controller";
import BrowserCreateConversationController from "../../controller/browser-create-conversation-controller";
import BrowserListConversationsController from "../../controller/browser-list-conversations-controller";
import BrowserListMessagesForConversationController from "../../controller/browser-list-messages-for-conversation-controller";
import BrowserListResearchContextsController from "../../controller/browser-list-research-contexts-controller";
import BrowserListSourceDataController from "../../controller/browser-list-source-data-controller";
import BrowserSendMessageToConversationController from "../../controller/browser-send-message-to-conversation-controller";
import BrowserAgentGateway from "../../gateway/browser-agent-gateway";
import BrowserConversationGateway from "../../gateway/browser-conversation-gateway";
import BrowserResearchContextGateway from "../../gateway/browser-research-context-gateway";
import { type CreateResearchContextInputPort } from "~/lib/core/ports/primary/create-research-context-primary-ports";
import { type TSignal } from "~/lib/core/entity/signals";
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


/** GATEWAYS */
clientContainer.bind(GATEWAYS.AGENT_GATEWAY).to(BrowserAgentGateway).inSingletonScope();
clientContainer.bind(GATEWAYS.CONVERSATION_GATEWAY).to(BrowserConversationGateway).inSingletonScope();
clientContainer.bind(GATEWAYS.RESEARCH_CONTEXT_GATEWAY).to(BrowserResearchContextGateway).inSingletonScope();
clientContainer.bind(GATEWAYS.VECTOR_STORE_GATEWAY).to(BrowserVectorStoreGateway).inSingletonScope();

clientContainer.bind(GATEWAYS.SOURCE_DATA_GATEWAY).to(BrowserSourceDataGateway).inSingletonScope();

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
    .toFactory<CreateResearchContextInputPort, [TSignal<TCreateResearchContextViewModel>]>((context: interfaces.Context) =>
        (response: TSignal<TCreateResearchContextViewModel>) => {
            const presenter = new BrowserCreateResearchContextPresenter(response);
            const agentGateway = context.container.get<AgentGatewayOutputPort<any>>(GATEWAYS.AGENT_GATEWAY);
            const researchContextGateway = context.container.get<ResearchContextGatewayOutputPort>(GATEWAYS.RESEARCH_CONTEXT_GATEWAY);
            const vectorStore = context.container.get<VectorStoreOutputPort>(GATEWAYS.VECTOR_STORE_GATEWAY);
            const usecase = new CreateResearchContextUsecase(presenter, researchContextGateway, agentGateway, vectorStore);
            return usecase;
        }
    );

clientContainer
    .bind<interfaces.Factory<SendMessageToConversationInputPort>>(USECASE_FACTORY.SEND_MESSAGE_TO_CONVERSATION)
    .toFactory<SendMessageToConversationInputPort, [TSignal<TSendMessageToConversationViewModel>]>((context: interfaces.Context) =>
        (response: TSignal<TSendMessageToConversationViewModel>) => {
            const presenter = new BrowserSendMessageToConversationPresenter(response);
            const agentGateway = context.container.get<AgentGatewayOutputPort<any>>(GATEWAYS.AGENT_GATEWAY);
            const conversationGateway = context.container.get<ConversationGatewayOutputPort>(GATEWAYS.CONVERSATION_GATEWAY);
            const usecase = new BrowserSendMessageToConversationUseCase(presenter, agentGateway, conversationGateway);
            return usecase;
        }
    );

/* eslint-enable  */

export default clientContainer;