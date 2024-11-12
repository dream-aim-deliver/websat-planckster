import { createTRPCRouter } from "~/lib/infrastructure/server/trpc/server";

import { conversationControllerRouter } from "./routers/controller/conversation-controller-router";
import { messageControllerRouter } from "./routers/controller/message-controller-router";
import { sourceDataControllerRouter } from "./routers/controller/source-data-controller-router";
import { researchContextControllerRouter } from "./routers/controller/research-context-controller-router";

import { agentGatewayRouter } from "./routers/gateway/agent-gateway-router";
import { conversationGatewayRouter } from "./routers/gateway/conversation-gateway-router";
import { researchContextGatewayRouter } from "./routers/gateway/research-context-gateway-router";
import { sourceDataGatewayRouter } from "./routers/gateway/source-data-gateway-router";
import { vectorStoreGatewayRouter } from "./routers/gateway/vector-store-gateway-router";

import { kernelPlancksterHealthCheckRouter } from "./routers/kernel/health-check";
import { caseStudyRepositoryRouter } from "./routers/repositories/case-study-repository-router";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  controllers: {
    conversation: conversationControllerRouter,
    message: messageControllerRouter,
    researchContext: researchContextControllerRouter,
    sourceData: sourceDataControllerRouter,
  },
  gateways: {
    agent: agentGatewayRouter,
    conversation: conversationGatewayRouter,
    researchContext: researchContextGatewayRouter,
    sourceData: sourceDataGatewayRouter,
    vectorStore: vectorStoreGatewayRouter,
  },
  repositories: {
    caseStudy: caseStudyRepositoryRouter,
  },
  kernel: {
    healthCheck: kernelPlancksterHealthCheckRouter,
  },
});

// export type definition of API
export type AppRouter = typeof appRouter;
