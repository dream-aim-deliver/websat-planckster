import { redirect } from "next/navigation";
import { DummyUploadComponent } from "../_components/dummy-upload";
import type AuthGatewayOutputPort from "~/lib/core/ports/secondary/auth-gateway-output-port";
import serverContainer from "~/lib/infrastructure/server/config/ioc/server-container";
import { GATEWAYS } from "~/lib/infrastructure/server/config/ioc/server-ioc-symbols";

export default async function Home() {
  const authGateway = serverContainer.get<AuthGatewayOutputPort>(
    GATEWAYS.AUTH_GATEWAY,
  );
  const sessionDTO = await authGateway.getSession();
  if (!sessionDTO.success) {
    redirect("/auth/login");
  }
  return <DummyUploadComponent />;
}

