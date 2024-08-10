import { redirect } from "next/navigation";
import { DummyUploadComponent } from "../_components/dummy-upload";
import type AuthGatewayOutputPort from "~/lib/core/ports/secondary/auth-gateway-output-port";
import serverContainer from "~/lib/infrastructure/server/config/ioc/server-container";
import { GATEWAYS } from "~/lib/infrastructure/server/config/ioc/server-ioc-symbols";
import { DummyDownloadComponent } from "../_components/dummy-download";

export default async function Home() {
  const authGateway = serverContainer.get<AuthGatewayOutputPort>(
    GATEWAYS.AUTH_GATEWAY,
  );
  const sessionDTO = await authGateway.getSession();
  if (!sessionDTO.success) {
    redirect("/auth/login");
  }
  return (
   <div className="flex flex-col gap-4">

      <DummyUploadComponent />

      <DummyDownloadComponent />

   </div> 
  );
}

