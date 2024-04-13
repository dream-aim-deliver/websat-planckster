import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

import { ClientService as sdk } from "@maany_shr/kernel-planckster-sdk-ts";

import { env } from "~/env";

export const sourceDataRouter = createTRPCRouter({
    listForClient: protectedProcedure
    .input(
        z.object({
            clientId: z.number(),
            xAuthToken: z.string(),
        }),
    )
    .query(async ({ input }) => {
        const viewModel = await sdk.listSourceData({
            id: input.clientId ?? env.KP_CLIENT_ID,
            xAuthToken: input.xAuthToken || env.KP_AUTH_TOKEN,
        });
        if(viewModel.status) {
            const sources = viewModel.source_data_list
            return sources;
        }
        // TODO: handle errors
        return [];

    }),

    listForResearchContext: protectedProcedure
    .input(
        z.object({
            researchContextId: z.number(),
            xAuthToken: z.string(),
        }),
    )
    .query(async ({ input }) => {
        const viewModel = await sdk.listSourceDataForResearchContext({
            id: input.researchContextId,
            xAuthToken: input.xAuthToken || env.KP_AUTH_TOKEN,
        });
        if(viewModel.status) {
            const sources = viewModel.source_data_list
            return sources;
        }
        // TODO: check if error can be handled
        return [];
    }),
});