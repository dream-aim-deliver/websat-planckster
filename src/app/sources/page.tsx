import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import { env } from "~/env";
import { redirect } from "next/navigation";

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
  return (
   <ul>
    {sourceData.map((data, index) => (
      <li key={index}>
        {data.relative_path}
      </li>
    ))}
  </ul>   

  );


}