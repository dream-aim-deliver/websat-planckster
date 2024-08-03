import { postRouter } from "~/lib/infrastructure/server/trpc-routers/post";
import { researchContextRouter } from "../../trpc-routers/research-contexts";
import { conversationRouter } from "../../trpc-routers/conversations";
import { messageRouter } from "../../trpc-routers/messages";
import { sourceDataRouter } from "../../trpc-routers/source-data";
import { kernelPlancksterHealthCheckRouter } from "../../trpc-routers/health-check";
import { createTRPCRouter } from "../../../trpc/trpc";


/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  researchContext: researchContextRouter,
  conversation: conversationRouter,
  message: messageRouter,
  sourceData: sourceDataRouter,
  healthCheck: kernelPlancksterHealthCheckRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

