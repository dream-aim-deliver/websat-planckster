import { postRouter } from "~/lib/server/infrastructure/trpc-routers/post";
import { createCallerFactory, createTRPCRouter } from "~/lib/server/infrastructure/config/trpc/trpc";
import { researchContextRouter } from "../../trpc-routers/research-contexts";
import { conversationRouter } from "../../trpc-routers/conversations";
import { messageRouter } from "../../trpc-routers/messages";
import { sourceDataRouter } from "../../trpc-routers/source-data";
import { kernelPlancksterHealthCheckRouter } from "../../trpc-routers/health-check";


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

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
