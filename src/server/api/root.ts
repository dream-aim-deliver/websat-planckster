import { postRouter } from "~/server/api/routers/post";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { researchContextRouter } from "./routers/research-contexts";
import { conversationRouter } from "./routers/conversations";
import { messageRouter } from "./routers/messages";
import { sourceDataRouter } from "./routers/source-data";

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
