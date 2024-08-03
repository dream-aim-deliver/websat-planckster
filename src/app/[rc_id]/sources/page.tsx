import { env } from "~/env";
import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/lib/server/auth";
import { api } from "~/lib/server/infrastructure/config/trpc/server";

export default async function Home(
    { params }: { params: { rc_id: string } }
) {
  const session = await getServerAuthSession();
  if (!session?.user) {
    redirect("/auth/login");
  };
  return (
        <ListSourceData rc_id={params.rc_id} />
  );
}

async function ListSourceData({ rc_id }: { rc_id: string }) {

  const rc_id_int = parseInt(rc_id);
  
  const session = await getServerAuthSession();
  if (!session?.user) return null;
  
  const sourceData = await api.sourceData.listForResearchContext(
    {
        researchContextId: rc_id_int,
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