import "reflect-metadata";
import { Container } from "inversify";
import { CONSTANTS, GATEWAYS, TRPC } from "./server-ioc-symbols";
import { authOptions } from "~/lib/infrastructure/server/config/auth/next-auth-config";
import type AuthGatewayOutputPort from "~/lib/core/ports/secondary/auth-gateway-output-port";
import NextAuthGateway from "~/lib/infrastructure/server/gateway/next-auth-gateway";
import { appRouter } from "~/lib/infrastructure/server/trpc/app-router";
import { api } from "~/lib/infrastructure/server/trpc/server-api";


const serverContainer = new Container();

/**NextAuthOptions */
serverContainer.bind(CONSTANTS.NEXT_AUTH_OPTIONS).toConstantValue(authOptions);

/** TRPC Server Side Router */
serverContainer.bind(TRPC.APP_ROUTER).toConstantValue(appRouter);

/** TRPC Server API : Should be used ONLY in Server Components */
serverContainer.bind(TRPC.REACT_SERVER_COMPONENTS_API).toConstantValue(api);

/**AuthGatewayOutputPort */
serverContainer.bind<AuthGatewayOutputPort>(GATEWAYS.AUTH_GATEWAY).to(NextAuthGateway).inSingletonScope();


export default serverContainer;

