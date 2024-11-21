import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../../server";
import { MessageSchema } from "~/lib/core/entity/kernel-models";
import serverContainer from "../../../config/ioc/server-container";
import { type Logger } from "pino";
import { GATEWAYS, UTILS } from "../../../config/ioc/server-ioc-symbols";
import type KernelConversationGateway from "../../../gateway/kernel-conversation-gateway";
import { type CreateConversationDTO, type ListConversationsDTO, type SendMessageToConversationResponseDTO } from "~/lib/core/dto/conversation-gateway-dto";
import { list } from "postcss";

export const conversationGatewayRouter = createTRPCRouter({
  sendMessageToConversation: protectedProcedure
    .input(
      z.object({
        conversationID: z.number(),
        message: MessageSchema,
      }),
    )
    .mutation(async ({ input }): Promise<SendMessageToConversationResponseDTO> => {
      const loggerFactory = serverContainer.get<(module: string) => Logger>(UTILS.LOGGER_FACTORY);
      const logger = loggerFactory("SendMessageToConversation TRPC Router");

      try {
        const gateway = serverContainer.get<KernelConversationGateway>(GATEWAYS.KERNEL_CONVERSATION_GATEWAY);

        const dto = await gateway.sendMessageToConversation(input.conversationID, input.message);

        return dto;
      } catch (error) {
        logger.error({ error }, "Could not invoke the server side feature to send message to conversation");
        return {
          success: false,
          data: {
            operation: "conversationGatewayRouter#sendMessageToConversation",
            message: "Could not invoke the server side feature to send message to conversation",
          },
        };
      }
    }),

  create: protectedProcedure
    .input(
      z.object({
        researchContextID: z.number(),
        title: z.string(),
      }),
    )
    .mutation(async ({ input }): Promise<CreateConversationDTO> => {
      const loggerFactory = serverContainer.get<(module: string) => Logger>(UTILS.LOGGER_FACTORY);
      const logger = loggerFactory("CreateConversation TRPC Router");

      try {
        const gateway = serverContainer.get<KernelConversationGateway>(GATEWAYS.KERNEL_CONVERSATION_GATEWAY);

        const dto = await gateway.createConversation(input.researchContextID, input.title);

        return dto;
      } catch (error) {
        logger.error({ error }, "Could not invoke the server side feature to create conversation");
        return {
          success: false,
          data: {
            operation: "conversationGatewayRouter#createConversation",
            message: "Could not invoke the server side feature to create conversation",
          },
        };
      }
    }),

  list: protectedProcedure
    .input(
      z.object({
        researchContextID: z.number(),
      }),
    )
    .query(async ({ input }): Promise<ListConversationsDTO> => {
      const loggerFactory = serverContainer.get<(module: string) => Logger>(UTILS.LOGGER_FACTORY);
      const logger = loggerFactory("ListConversations TRPC Router");

      try {
        const gateway = serverContainer.get<KernelConversationGateway>(GATEWAYS.KERNEL_CONVERSATION_GATEWAY);
        const dto = await gateway.listConversations(input.researchContextID);
        return dto;
      } catch (error) {
        logger.error({ error }, "Could not invoke the server side feature to list conversations");
        return {
          success: false,
          data: {
            operation: "conversationGatewayRouter#list",
            message: "Could not invoke the server side feature to list conversations",
          },
        };
      }
    }),
});
