import { inject, injectable } from "inversify";
import { getServerSession, type NextAuthOptions } from "next-auth";
import { TSession } from "~/lib/core/entity/auth/session";
import AuthGatewayOutputPort from "~/lib/core/ports/secondary/auth-gateway-output-port";
import { CONSTANTS } from "../config/ioc/server-ioc-symbols";

@injectable()
export default class NextAuthGateway implements AuthGatewayOutputPort{
    constructor(
        @inject(CONSTANTS.NEXT_AUTH_OPTIONS) private authOptions: NextAuthOptions,
    ) {}

    async getSession(): Promise<TSession | null> {
        return getServerSession(this.authOptions);
    }
    

}