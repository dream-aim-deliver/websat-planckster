import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../../server";
import { MessageSchema, type TMessage } from "~/lib/core/entity/kernel-models";
import serverContainer from "../../../config/ioc/server-container";
import { type Logger } from "pino";
import { GATEWAYS, UTILS } from "../../../config/ioc/server-ioc-symbols";
import type OpenAIAgentGateway from "../../../gateway/openai-agent-gateway";
import { type TCreateAgentDTO, type TSendMessageDTO } from "~/lib/core/dto/agent-dto";
import { RemoteFileSchema } from "~/lib/core/entity/file";

export const agentGatewayRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        researchContextTitle: z.string(),
        researchContextDescription: z.string(),
        vectorStoreID: z.string(),
        additionalFiles: z.array(RemoteFileSchema).optional(),
        agentSystemInstructions: z.string().optional(),
      }),
    )
    .mutation(async ({ input }): Promise<TCreateAgentDTO> => {
      const loggerFactory = serverContainer.get<(module: string) => Logger>(UTILS.LOGGER_FACTORY);
      const logger = loggerFactory("CreateAgent TRPC Router");

      try {
        const agentGateway = serverContainer.get<OpenAIAgentGateway>(GATEWAYS.AGENT_GATEWAY);

        const dto = await agentGateway.createAgent(input.researchContextTitle, input.researchContextDescription, input.vectorStoreID, input.additionalFiles, input.agentSystemInstructions);

        return dto;
      } catch (error) {
        logger.error({ error }, "Could not invoke the server side feature to create agent");
        return {
          success: false,
          data: {
            operation: "agentGatewayRouter#create",
            message: "Could not invoke the server side feature to create agent",
          },
        };
      }
    }),

  prepareMessageContext: protectedProcedure
    .input(
      z.object({
        researchContextExternalID: z.string(),
        conversationID: z.number(),
      }),
    )
    .query(async ({ input }): Promise<{ data: { assistantID: string; messagesToSend: TMessage[] }; success: true } | { data: { message: string; operation: string }; success: false }> => {
      const loggerFactory = serverContainer.get<(module: string) => Logger>(UTILS.LOGGER_FACTORY);
      const logger = loggerFactory("PrepareMessageContext TRPC Router");

      try {
        const agentGateway = serverContainer.get<OpenAIAgentGateway>(GATEWAYS.AGENT_GATEWAY);

        const dto = await agentGateway.prepareMessageContext(input.researchContextExternalID, input.conversationID);

        return dto;
      } catch (error) {
        logger.error({ error }, "Could not invoke the server side feature to prepare message context");
        return {
          success: false,
          data: {
            operation: "agentGatewayRouter#prepareMessageContext",
            message: "Could not invoke the server side feature to prepare message context",
          },
        };
      }
    }),

  sendMessage: protectedProcedure
    .input(
      z.object({
        context: z.object({
          assistantID: z.string(),
          messagesToSend: z.array(MessageSchema),
        }),
        message: MessageSchema,
      }),
    )
    .mutation(async ({ input }): Promise<TSendMessageDTO> => {
      const loggerFactory = serverContainer.get<(module: string) => Logger>(UTILS.LOGGER_FACTORY);

      const logger = loggerFactory("SendMessage TRPC Router");

      try {
        const agentGateway = serverContainer.get<OpenAIAgentGateway>(GATEWAYS.AGENT_GATEWAY);

        const dto = await agentGateway.sendMessage(input.context, input.message);

        return dto;
      } catch (error) {
        logger.error({ error }, "Could not invoke the server side feature to send message");
        return {
          success: false,
          data: {
            operation: "agentGatewayRouter#sendMessage",
            message: "Could not invoke the server side feature to send message",
          },
        };
      }
    }),
});
