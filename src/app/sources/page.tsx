import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import { env } from "~/env";
import { redirect } from "next/navigation";
import { DummyUploadComponent } from "../_components/dummy-upload";
import { DummyDownloadComponent } from "../_components/dummy-download";

export default async function Home() {
  const session = await getServerAuthSession();
  if (!session?.user) {
    redirect("/auth/login");
  };
  return (
        <ListSourceData />
  );
}

async function ListSourceData() {

  const session = await getServerAuthSession();
  if (!session?.user) return null;
  
  const sourceData = await api.sourceData.listForClient(
    {
        clientId: env.KP_CLIENT_ID, 
        xAuthToken: env.KP_AUTH_TOKEN
    }
  )

  // Return a simple HTML unordered list
  // Plus something to see the uploadSourceData result
  return (
    <div>
      <ul>
        {sourceData.map((data, index) => (
          <li key={index}>
            {data.relative_path}
          </li>
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