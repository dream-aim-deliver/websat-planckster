import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/lib/infrastructure/trpc/trpc";

import { ClientService as sdk } from "@maany_shr/kernel-planckster-sdk-ts";
import type { NewResearchContextViewModel } from "@maany_shr/kernel-planckster-sdk-ts";
import { env } from "~/env";
import type AuthGatewayOutputPort from "~/lib/core/ports/secondary/auth-gateway-output-port";
import serverContainer from "../config/ioc/server-container";
import { GATEWAYS } from "../config/ioc/server-ioc-symbols";

export const researchContextRouter = createTRPCRouter({
  list: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        xAuthToken: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const viewModel = await sdk.listResearchContexts({
        id: input.id ?? env.KP_CLIENT_ID,
        xAuthToken: input.xAuthToken || env.KP_AUTH_TOKEN,
      });
      if (viewModel.status) {
        const researchContexts = viewModel.research_contexts;
        return researchContexts;
      }
      // TODO: handle error
      return [];
    }),
  create: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string(),
        sourceDataIdList: z.array(z.number()),
      }),
    )
    .mutation(async ({ input }) => {
      const authGateway = serverContainer.get<AuthGatewayOutputPort>(GATEWAYS.AUTH_GATEWAY);
      const session = await authGateway.getSession();
      const userID = session?.user.id;
      const viewModel: NewResearchContextViewModel = await sdk.createResearchContext({
        clientSub: userID,
        requestBody: input.sourceDataIdList,
        xAuthToken: env.KP_AUTH_TOKEN,
        researchContextTitle: input.title,
        researchContextDescription: input.description,
      })
      if (viewModel.status) {
        return viewModel;
      }
      // TODO : handle error
      return {};
    }),
});
