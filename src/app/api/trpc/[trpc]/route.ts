import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { type NextRequest } from "next/server";

import { env } from "~/env";
import serverContainer from "~/lib/infrastructure/server/config/ioc/server-container";
import { TRPC } from "~/lib/infrastructure/server/config/ioc/server-ioc-symbols";
import { type AppRouter } from "~/lib/infrastructure/server/trpc/app-router";
import { createTRPCContext } from "~/lib/infrastructure/server/trpc/server";

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a HTTP request (e.g. when you make requests from Client Components).
 */
const createContext = async (req: NextRequest) => {
  return createTRPCContext({
    headers: req.headers,
  });
};

const handler = (req: NextRequest) => {
  const appRouter: AppRouter = serverContainer.get(TRPC.APP_ROUTER);
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => createContext(req),
    onError:
      env.NODE_ENV === "development"
        ? ({ path, error }) => {
            console.error(
              `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`
            );
          }
        : undefined,
  })};

export { handler as GET, handler as POST };
