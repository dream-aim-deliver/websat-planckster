import "reflect-metadata";
import { Container } from "inversify";
import { CONSTANTS, GATEWAYS } from "./server-ioc-symbols";
import { authOptions } from "../auth/next-auth-config";
import type AuthGatewayOutputPort from "~/lib/core/ports/secondary/auth-gateway-output-port";
import NextAuthGateway from "../../gateway/next-auth-gateway";


const serverContainer = new Container();

/**NextAuthOptions */
serverContainer.bind(CONSTANTS.NEXT_AUTH_OPTIONS).toConstantValue(authOptions);

/**AuthGatewayOutputPort */
serverContainer.bind<AuthGatewayOutputPort>(GATEWAYS.AUTH_GATEWAY).to(NextAuthGateway).inSingletonScope();
export default serverContainer;

