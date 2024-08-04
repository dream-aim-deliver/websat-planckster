import { env } from "~/env";
import { redirect } from "next/navigation";
import { DummyUploadComponent } from "../_components/dummy-upload";
import { DummyDownloadComponent } from "../_components/dummy-download";
import { api } from "~/lib/infrastructure/server/trpc/server-api";
import type AuthGatewayOutputPort from "~/lib/core/ports/secondary/auth-gateway-output-port";
import serverContainer from "~/lib/infrastructure/server/config/ioc/server-container";
import { GATEWAYS } from "~/lib/infrastructure/server/config/ioc/server-ioc-symbols";

export default async function Home() {
  const authGateway = serverContainer.get<AuthGatewayOutputPort>(
    GATEWAYS.AUTH_GATEWAY,
  );
  const session = await authGateway.getSession();
  if (!session?.user) {
    redirect("/auth/login");
  }
  return <ListSourceData />;
}

async function ListSourceData() {
  const authGateway = serverContainer.get<AuthGatewayOutputPort>(
    GATEWAYS.AUTH_GATEWAY,
  );
  const session = await authGateway.getSession();
  if (!session?.user) return null;

  const sourceData = await api.sourceData.listForClient({
    clientId: env.KP_CLIENT_ID,
    xAuthToken: env.KP_AUTH_TOKEN,
  });

  // Return a simple HTML unordered list
  // Plus something to see the uploadSourceData result
  return (
    <div>
      <ul>
        {sourceData.map((data, index) => (
          <li key={index}>{data.relative_path}</li>
        ))}
      </ul>
      <DummyUploadComponent
        clientId={env.KP_CLIENT_ID}
        protocol="s3"
        xAuthToken={env.KP_AUTH_TOKEN}
        relativePath="mdtest1.md"
        sourceDataName="Test Markdown File #1"
        localFilePath="/home/alebg/test/mdtest.md"
      />
      <DummyDownloadComponent
        clientId={env.KP_CLIENT_ID}
        protocol="s3"
        xAuthToken={env.KP_AUTH_TOKEN}
        relativePath="mdtest1.md"
        localFilePath="/home/alebg/test/mdtest1_downloaded_from_websat.md"
      />
    </div>
  );
}
