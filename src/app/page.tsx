import { CreatePost } from "~/app/_components/create-post";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import { env } from "~/env";
import { redirect } from "next/navigation";
import { ListResearchContextsPage } from "./_components/list-research-contexts";
export default async function Home() {
  const session = await getServerAuthSession();
  if (!session?.user) {
    redirect("/auth/login");
  };
  return (
        <ListResearchContexts />
  );
}

async function CrudShowcase() {
  const session = await getServerAuthSession();
  if (!session?.user) return null;

  const latestPost = await api.post.getLatest();

  return (
    <div className="w-full max-w-xs">
      {latestPost ? (
        <p className="truncate">Your most recent post: {latestPost.name}</p>
      ) : (
        <p>You have no posts yet.</p>
      )}

      <CreatePost />
    </div>
  );
}

async function ListResearchContexts() {
  const session = await getServerAuthSession();
  if (!session?.user) return null;

  const researchContexts = await api.researchContext.list(
    { id: env.KP_CLIENT_ID, xAuthToken: env.KP_AUTH_TOKEN },
  );

  return (
    <ListResearchContextsPage researchContexts={researchContexts}
    kernelPlancksterHost={env.KP_HOST}
     />
  );
}