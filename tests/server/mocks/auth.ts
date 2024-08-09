import AuthGatewayOutputPort from "~/lib/core/ports/secondary/auth-gateway-output-port";
import serverContainer from "~/lib/infrastructure/server/config/ioc/server-container"
import { GATEWAYS } from "~/lib/infrastructure/server/config/ioc/server-ioc-symbols";

export const loadAuthMocks = () => {
    const authGateway = serverContainer.get<AuthGatewayOutputPort>(GATEWAYS.AUTH_GATEWAY)
    authGateway.extractKPCredentials = jest.fn().mockResolvedValue({
        success: true,
        data: {
            clientID: 123,
            xAuthToken: "test-token",
        }
    });
    authGateway.getSession = jest.fn().mockResolvedValue({
        success: true,
        data: {
            user: {
                id: "user-id",
                name: "test-user",
                email: "test@test-user",
                image: "test-image",
                kp: {
                    client_id: 123,
                    auth_token: "test123",
                },
                role: "USER"
            },
            expires: new Date().toISOString(),
        }
    });
}
