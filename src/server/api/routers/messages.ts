import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

import { ClientService as sdk } from "@maany_shr/kernel-planckster-sdk-ts";
import { env } from "~/env";

export const messageRouter = createTRPCRouter({
    list: protectedProcedure
    .input(
        z.object({
            id: z.number(),
            xAuthToken: z.string(),
        }),
    )
    .query(async ({ input }) => {
        const viewModel = await sdk.listMessages({
            id: input.id,
            xAuthToken: input.xAuthToken || env.KP_AUTH_TOKEN,
        });
        if(viewModel.status) {
            const messages = viewModel.message_list
            return messages;
        }
        // TODO: check if error can be handled, otherwise change KP's presenter
        return [];
    }),

});