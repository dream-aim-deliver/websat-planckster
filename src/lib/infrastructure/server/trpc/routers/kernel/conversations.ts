import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/lib/infrastructure/server/trpc/server";
import serverContainer from "../../../config/ioc/server-container";
import { GATEWAYS } from "../../../config/ioc/server-ioc-symbols";
import type ConversationGatewayOutputPort from "~/lib/core/ports/secondary/conversation-gateway-output-port";
import { type CreateConversationDTO, type ListConversationsDTO } from "~/lib/core/dto/conversation-gateway-dto";


export const conversationRouter = createTRPCRouter({

    /**
     * NOTE: this is a gateway-to-gateway router function, so it pipes a DTO
     */
    list: protectedProcedure
    .input(
        z.object({
            researchContextID: z.number(),
        }),
    )
    .query(async ({ input }): Promise<ListConversationsDTO> => {

        const conversationGateway = serverContainer.get<ConversationGatewayOutputPort>(GATEWAYS.KERNEL_CONVERSATION_GATEWAY);

        const dto = await conversationGateway.listConversations(input.researchContextID.toString());

        return dto;

    }),


    /**
     * NOTE: this is a gateway-to-gateway router function, so it pipes a DTO
     */
    create: protectedProcedure
        .input(
            z.object({
                researchContextID: z.number(),
                conversationTitle: z.string(),
            }),
        )
        .mutation(async ({ input }): Promise<CreateConversationDTO> => {

            const conversationGateway = serverContainer.get<ConversationGatewayOutputPort>(GATEWAYS.KERNEL_CONVERSATION_GATEWAY);

            const dto = await conversationGateway.createConversation(input.researchContextID.toString(), input.conversationTitle);

            return dto;
        }),

});