import { postRouter } from "~/lib/infrastructure/server/trpc/routers/post";
import { researchContextRouter } from "~/lib/infrastructure/server/trpc/routers/kernel/research-contexts";
import { kernelPlancksterHealthCheckRouter } from "./routers/kernel/health-check";
import { createTRPCRouter, protectedProcedure } from "~/lib/infrastructure/server/trpc/server";
import { createResearchContextsRouter } from "./routers/research-contexts/create-research-contexts-router";
import serverContainer from "../config/ioc/server-container";
import { CONTROLLERS } from "../config/ioc/server-ioc-symbols";
import type ListResearchContextsController from "../controller/list-research-contexts-controller";
import { type TListResearchContextsViewModel } from "~/lib/core/view-models/list-research-contexts-view-models";
import { z } from "zod";
import { serverFileRouter } from "./routers/server/server-file-router";
import { conversationRouter } from "./routers/controller/conversation-router";
import { messageRouter } from "./routers/controller/message-router";
import { sourceDataRouter as sourceDataControllerRouter } from "./routers/controller/source-data";
import { sourceDataRouter as sourceDataGatewayRouter } from "./routers/gateway/source-data";
import { researchContextGatewayRouter } from "./routers/gateway/research-context";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  controllers: {
    conversation: conversationRouter,
    message: messageRouter,
    sourceData: sourceDataControllerRouter,
  },
  gateways : {
    sourceData: sourceDataGatewayRouter,
    researchContext: researchContextGatewayRouter,

  },
  kernel: {
    researchContext: researchContextRouter,
    healthCheck: kernelPlancksterHealthCheckRouter,
  },
  post: postRouter,
  server: {
    file: serverFileRouter,
  },
  // openai: {
  //   file: openAIFileRouter,
  //   vector: openAIVectorStoreRouter,
  //   assistant: openAIAssistantRouter,
  // },
  researchContexts: {
    create: createResearchContextsRouter,
    list: protectedProcedure.query(async () => {
      // call a server controller and usecase to fetch research contexts, try to fix any errors
      const response: TListResearchContextsViewModel = {
        status: "request"
      }
      const controller = serverContainer.get<ListResearchContextsController>(CONTROLLERS.LIST_RESEARCH_CONTEXTS_CONTROLLER)
      // await controller.execute({ response: response, clientID: "1234" })
      return response;
    }),
  },
  agent: {
    create: protectedProcedure
      .input(z.object({

      })
      ).mutation(async ({ input }) => {
        // call a server controller and usecase to create an agent, try to fix any errors
        return { status: "request" }
      }),
    vectorStores: {
      list: protectedProcedure.query(async () => {
        // call a server controller and usecase to fetch vector stores, try to fix any errors
        return { status: "request" }
      }),
      create: protectedProcedure
        .input(z.object({

        })
        ).mutation(async ({ input }) => {
          // call a server controller and usecase to create a vector store, try to fix any errors
          return { status: "request" }
        }),
    },
    list: protectedProcedure.query(async () => {
      return { status: "request" }
    }),
    sendMessage: protectedProcedure.mutation(async ({ input }) => {
      // call a server controller and usecase to send a message, try to fix any errors
      return { status: "request" }
    }),
  }
});

// export type definition of API
export type AppRouter = typeof appRouter;

