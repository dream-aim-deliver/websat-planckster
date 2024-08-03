import type { TSession } from "~/lib/core/entity/auth/session";

/**
 * Represents the output port for the authentication gateway.
 */
export default interface AuthGatewayOutputPort{
    getSession(): Promise<TSession | null>;
}