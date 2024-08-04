import { postRouter } from "~/lib/infrastructure/server/trpc/routers/post";
import { researchContextRouter } from "~/lib/infrastructure/server/trpc/routers/research-contexts";
import { conversationRouter } from "~/lib/infrastructure/server/trpc/routers/conversations";
import { messageRouter } from "~/lib/infrastructure/server/trpc/routers/messages";
import { sourceDataRouter } from "~/lib/infrastructure/server/trpc/routers/source-data";
import { kernelPlancksterHealthCheckRouter } from "./routers/health-check";
import { createTRPCRouter } from "~/lib/infrastructure/server/trpc/server";


/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  kernel: {
    researchContext: researchContextRouter,
    conversation: conversationRouter,
    message: messageRouter,
    sourceData: sourceDataRouter,
    healthCheck: kernelPlancksterHealthCheckRouter,
  },
  post: postRouter,

});

// export type definition of API
export type AppRouter = typeof appRouter;

