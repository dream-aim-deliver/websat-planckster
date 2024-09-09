/* eslint-disable @typescript-eslint/no-unused-vars */
import "reflect-metadata";
import { Container, type interfaces } from "inversify";
import { CONSTANTS, GATEWAYS, KERNEL, OPENAI, TRPC, REPOSITORY, UTILS, CONTROLLERS } from "./server-ioc-symbols";
import { authOptions } from "~/lib/infrastructure/server/config/auth/next-auth-config";
import type AuthGatewayOutputPort from "~/lib/core/ports/secondary/auth-gateway-output-port";
import NextAuthGateway from "~/lib/infrastructure/server/gateway/next-auth-gateway";
import { appRouter } from "~/lib/infrastructure/server/trpc/app-router";
import { api } from "~/lib/infrastructure/server/trpc/server-api";
import OpenAIAgentGateway from "../../gateway/openai-agent-gateway";
import OpenAIClient from "../openai/openai-client";
import { KernelSDK } from "../kernel/kernel-sdk";
import type { Logger } from "pino";
import rootLogger from "../log/pino-server-config";
import OpenAISourceDataGateway from "../../gateway/openai-source-data-gateway";
import KernelSourceDataGateway from "../../gateway/kernel-source-data-gateway";
import ListResearchContextsController from "../../controller/list-research-contexts-controller";
import ResearchContextGateway from "../../gateway/research-context-gateway";
import OpenAIVectorStoreGateway from "../../gateway/openai-vector-store-gateway";
import KernelConversationGateway from "../../gateway/kernel-conversation-gateway";
import CreateConversationController from "../../controller/create-conversation-controller";
import ListConversationsController from "../../controller/list-conversations-controller";
import ListMessagesForConversationController from "../../controller/list-messages-for-conversation-controller";
import ListSourceDataController from "../../controller/list-source-data-controller";
import { ListSourceDataInputPort } from "~/lib/core/ports/primary/list-source-data-primary-ports";
import { USECASE_FACTORY } from "~/lib/infrastructure/server/config/ioc/server-ioc-symbols";
import { TSignal } from "~/lib/core/entity/signals";
import { TListSourceDataViewModel } from "~/lib/core/view-models/list-source-data-view-models";
import ListSourceDataPresenter from "../../presenter/list-source-data-presenter";
import ListSourceDataUseCase from "~/lib/core/usecase/list-source-data-usecase";
import SourceDataGatewayOutputPort from "~/lib/core/ports/secondary/source-data-gateway-output-port";

const serverContainer = new Container();

/** TRPC */
serverContainer.bind(TRPC.APP_ROUTER).toConstantValue(appRouter);

/** TRPC Server API : Should be used ONLY in Server Components */
serverContainer.bind(TRPC.REACT_SERVER_COMPONENTS_API).toConstantValue(api);

/** Aspect: Auth */
serverContainer.bind(CONSTANTS.NEXT_AUTH_OPTIONS).toConstantValue(authOptions);
serverContainer.bind<AuthGatewayOutputPort>(GATEWAYS.AUTH_GATEWAY).to(NextAuthGateway).inSingletonScope();

/** Aspect: Logging */
serverContainer.bind<interfaces.Factory<Logger>>(UTILS.LOGGER_FACTORY).toFactory<Logger, [string]>((context: interfaces.Context) =>
    (module: string) => {
        const logger = rootLogger.child({ module: module });
        return logger;
    }
);

/** OPENAI */
serverContainer.bind(OPENAI.OPENAI_CLIENT).toConstantValue(OpenAIClient);
serverContainer.bind(OPENAI.OPENAI_SOURCE_DATA_GATEWAY).to(OpenAISourceDataGateway);

/** KERNEL */
serverContainer.bind(KERNEL.KERNEL_SDK).toConstantValue(KernelSDK);

/** GATEWAYS */
serverContainer.bind(GATEWAYS.AGENT_GATEWAY).to(OpenAIAgentGateway);
serverContainer.bind(GATEWAYS.KERNEL_SOURCE_DATA_GATEWAY).to(KernelSourceDataGateway);
serverContainer.bind(GATEWAYS.RESEARCH_CONTEXT_GATEWAY).to(ResearchContextGateway);
serverContainer.bind(GATEWAYS.VECTOR_STORE_GATEWAY).to(OpenAIVectorStoreGateway);
serverContainer.bind(GATEWAYS.KERNEL_CONVERSATION_GATEWAY).to(KernelConversationGateway);

/** REPOSITORY */


/** CONTROLLERS */
serverContainer.bind(CONTROLLERS.CREATE_CONVERSATION_CONTROLLER).to(CreateConversationController)
serverContainer.bind(CONTROLLERS.LIST_CONVERSATIONS_CONTROLLER).to(ListConversationsController)
serverContainer.bind(CONTROLLERS.LIST_MESSAGES_CONTROLLER).to(ListMessagesForConversationController)
serverContainer.bind(CONTROLLERS.LIST_RESEARCH_CONTEXTS_CONTROLLER).to(ListResearchContextsController)
serverContainer.bind(CONTROLLERS.LIST_SOURCE_DATA_CONTROLLER).to(ListSourceDataController)


serverContainer
    .bind<interfaces.Factory<ListSourceDataInputPort>>(
        USECASE_FACTORY.LIST_SOURCE_DATA_USECASE_FACTORY
    )
    .toFactory<ListSourceDataInputPort, [TSignal<TListSourceDataViewModel>]>((context: interfaces.Context) =>
        (response: TSignal<TListSourceDataViewModel>) => {
            const loggerFactory = context.container.get<(module: string) => Logger>(UTILS.LOGGER_FACTORY);
            const presenter = new ListSourceDataPresenter(response, loggerFactory);
            const sourceDataGateway = context.container.get<SourceDataGatewayOutputPort>(GATEWAYS.KERNEL_SOURCE_DATA_GATEWAY);
            const usecase = new ListSourceDataUseCase(presenter, sourceDataGateway);
            return usecase;
        }
    );
export default serverContainer;