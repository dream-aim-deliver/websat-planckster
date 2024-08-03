import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/lib/server/infrastructure/config/trpc/trpc";

import { ClientService as sdk } from "@maany_shr/kernel-planckster-sdk-ts";
import { env } from "~/env";

export const conversationRouter = createTRPCRouter({
    list: protectedProcedure
    .input(
        z.object({
            id: z.number(),
            xAuthToken: z.string(),
        }),
    )
    .query(async ({ input }) => {
        const viewModel = await sdk.listConversations({
            id: input.id,
            xAuthToken: input.xAuthToken || env.KP_AUTH_TOKEN,
        });
        if(viewModel.status) {
            const conversations = viewModel.conversations
            return conversations;
        }
        // TODO: check if error can be handled, otherwise change KP's presenter
        return [];
    }),

    create: protectedProcedure
        .input(
            z.object({
                id: z.number(),
                title: z.string(),
            }),
        )
        .mutation(async ({ input }) => {
            const viewModel = await sdk.createConversation({
                id: input.id,
                xAuthToken: env.KP_AUTH_TOKEN,
                conversationTitle: input.title,
            });
            if(viewModel.status) {
                return viewModel;
            }
            // TODO: check if error can be handled, otherwise change KP's presenter
            return {};
        }),
});