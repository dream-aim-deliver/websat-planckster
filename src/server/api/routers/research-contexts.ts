import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

import { NewResearchContextViewModel, ClientService as sdk } from "@maany_shr/kernel-planckster-sdk-ts";
import { env } from "~/env";
import { getServerAuthSession } from "~/server/auth";

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
        sourcesID : z.array(z.number()),
        // TODO add sourceDataList
        // sourceDataList: z.array(z.object({
        //   lfn: z.object({

        // })),
      }),
    )
    .mutation(async ({ input }) => {
      const session = await getServerAuthSession();
      const userID = session?.user.id;
      const viewModel: NewResearchContextViewModel = await sdk.createResearchContext({
        clientSub: userID,
        requestBody: [],
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