import AuthGatewayOutputPort from "~/lib/core/ports/secondary/auth-gateway-output-port";
import serverContainer from "~/lib/infrastructure/server/config/ioc/server-container";
import { GATEWAYS } from "~/lib/infrastructure/server/config/ioc/server-ioc-symbols";

export const loadAuthMocks = () => {
  const authGateway = serverContainer.get<AuthGatewayOutputPort>(GATEWAYS.AUTH_GATEWAY);
  authGateway.extractKPCredentials = jest.fn().mockResolvedValue({
    success: true,
    data: {
      clientID: 1,
      xAuthToken: "test123",
    },
  });
  authGateway.getSession = jest.fn().mockResolvedValue({
    success: true,
    data: {
      user: {
        id: "user-id",
        name: "test-user",
        email: "test@test-user",
        images: "test-image",
        kp: {
          client_id: 1,
          auth_token: "test123",
        },
        role: "USER",
      },
      expires: new Date().toISOString(),
    },
  });
};
