/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import "server-only";

import { createCallerFactory } from "./trpc";
import { appRouter } from "../server/config/trpc/root";
import createContext from "../server/config/trpc/context";

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);


/**
 * This is the tRPC caller that is used to make tRPC calls from React Server Components.
 */
export const api = createCaller(createContext);
