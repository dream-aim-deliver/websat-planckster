import { z } from "zod";

import { ClientService as sdk } from "@maany_shr/kernel-planckster-sdk-ts";
import { createTRPCRouter, protectedProcedure } from "~/lib/infrastructure/server/trpc/server";
import serverContainer from "../../config/ioc/server-container";
import type AuthGatewayOutputPort from "~/lib/core/ports/secondary/auth-gateway-output-port";
import { GATEWAYS } from "../../config/ioc/server-ioc-symbols";

export const conversationRouter = createTRPCRouter({
    list: protectedProcedure
    .input(
        z.object({
            id: z.number(),  // Research context ID
        }),
    )
    .query(async ({ input }) => {

        const authGateway = serverContainer.get<AuthGatewayOutputPort>(GATEWAYS.AUTH_GATEWAY);
        const kpCredentialsDTO = await authGateway.extractKPCredentials();

        if (!kpCredentialsDTO.success) {
            return [];
        }

        const viewModel = await sdk.listConversations({
            id: input.id,
            xAuthToken: kpCredentialsDTO.data.xAuthToken,
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
                id: z.number(),  // Research context ID
                title: z.string(),
            }),
        )
        .mutation(async ({ input }) => {

            const authGateway = serverContainer.get<AuthGatewayOutputPort>(GATEWAYS.AUTH_GATEWAY);
            const kpCredentialsDTO = await authGateway.extractKPCredentials();

            if (!kpCredentialsDTO.success) {
                return {};
            }

            const viewModel = await sdk.createConversation({
                id: input.id,
                xAuthToken: kpCredentialsDTO.data.xAuthToken,
                conversationTitle: input.title,
            });
            if(viewModel.status) {
                return viewModel;
            }
            // TODO: check if error can be handled, otherwise change KP's presenter
            return {};
        }),
});