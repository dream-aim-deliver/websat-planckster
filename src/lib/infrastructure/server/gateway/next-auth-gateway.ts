import { inject, injectable } from "inversify";
import { getServerSession, type NextAuthOptions } from "next-auth";
import { SessionSchema, TSession } from "~/lib/core/entity/auth/session";
import AuthGatewayOutputPort from "~/lib/core/ports/secondary/auth-gateway-output-port";
import { CONSTANTS } from "../config/ioc/server-ioc-symbols";
import { ExtractKPCredentialsDTO, GetSessionDTO } from "~/lib/core/dto/auth-dto";

@injectable()
export default class NextAuthGateway implements AuthGatewayOutputPort {
    constructor(
        @inject(CONSTANTS.NEXT_AUTH_OPTIONS) private authOptions: NextAuthOptions,
    ) { }

    async getSession(): Promise<GetSessionDTO> {
        const session = await getServerSession(this.authOptions);
        if (!session) {
            return {
                success: false,
                data: {
                    operation: "NextAuthGateway#GetSession",
                    message: "Session not found",
                },
            };
        }
        if(!session.user) {
            return {
                success: false,
                data: {
                    operation: "NextAuthGateway#GetSession",
                    message: "User not found in session",
                },
            };
        }
        // validate user schema
        const schemaValidationResult = SessionSchema.safeParse(session);
        if (!schemaValidationResult.success) {
            return {
                success: false,
                data: {
                    operation: "NextAuthGateway#GetSession",
                    message: "Session schema validation failed. Dumping errors: " + schemaValidationResult.error.message,
                },
            };
        }

        return {
            success: true,
            data: session as unknown as TSession,

        };
    }

    async extractKPCredentials(): Promise<ExtractKPCredentialsDTO> {
        const sessionDTO = await this.getSession();
        if (!sessionDTO.success) {
            return {
                success: false,
                data: {
                    message: "User not authenticated",
                },
            };
        }

        const user = sessionDTO.data.user;

        return {
            success: true,
            data: {
                clientID: user.kp.client_id,
                xAuthToken: user.kp.auth_token,
            },
        };
    }
}