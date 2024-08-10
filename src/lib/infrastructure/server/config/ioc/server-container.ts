/* eslint-disable @typescript-eslint/no-unused-vars */
import "reflect-metadata";
import { Container, type interfaces } from "inversify";
import { CONSTANTS, GATEWAYS, KERNEL, OPENAI, TRPC, REPOSITORY, UTILS } from "./server-ioc-symbols";
import { authOptions } from "~/lib/infrastructure/server/config/auth/next-auth-config";
import type AuthGatewayOutputPort from "~/lib/core/ports/secondary/auth-gateway-output-port";
import NextAuthGateway from "~/lib/infrastructure/server/gateway/next-auth-gateway";
import { appRouter } from "~/lib/infrastructure/server/trpc/app-router";
import { api } from "~/lib/infrastructure/server/trpc/server-api";
import OpenAIAgentGateway from "../../gateway/openai-agent-gateway";
import OpenAIClient from "../openai/openai-client";
import { KernelSDK } from "../kernel/kernel-sdk";
import OpenAIFileRepository from "../../repository/openai-remote-storage-element";
import KernelFileRepository from "../../repository/kernel-remote-storage-element";
import type { Logger } from "pino";
import rootLogger from "../log/pino-server-config";

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
serverContainer.bind(OPENAI.OPENAI_FILE_REPOSITORY).to(OpenAIFileRepository)

/** KERNEL */
serverContainer.bind(KERNEL.KERNEL_SDK).toConstantValue(KernelSDK);

/** GATEWAYS */
serverContainer.bind(GATEWAYS.AGENT_GATEWAY).to(OpenAIAgentGateway);

/** REPOSITORY */
serverContainer.bind(REPOSITORY.KERNEL_FILE_REPOSITORY).to(KernelFileRepository);

export default serverContainer;

