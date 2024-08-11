import { z } from "zod";

import { ClientService as sdk, type NewConversationViewModel } from "@maany_shr/kernel-planckster-sdk-ts";
import { createTRPCRouter, protectedProcedure } from "~/lib/infrastructure/server/trpc/server";
import type AuthGatewayOutputPort from "~/lib/core/ports/secondary/auth-gateway-output-port";
import type { TBaseErrorDTOData } from "~/sdk/core/dto";
import type { Logger } from "pino";
import serverContainer from "../../../config/ioc/server-container";
import { UTILS, GATEWAYS, KERNEL } from "../../../config/ioc/server-ioc-symbols";
import { TKernelSDK } from "../../../config/kernel/kernel-sdk";

const getLogger = () => {
  const loggerFactory = serverContainer.get<(module: string) => Logger>(UTILS.LOGGER_FACTORY);
  const logger = loggerFactory("conversationRouter");
  return logger;
}

export const conversationRouter = createTRPCRouter({
    list: protectedProcedure
    .input(
        z.object({
            id: z.number(),  // Research context ID
        }),
    )
    .query(async ({ input }) => {

        const logger = getLogger();
        const authGateway = serverContainer.get<AuthGatewayOutputPort>(GATEWAYS.AUTH_GATEWAY);
        const kpCredentialsDTO = await authGateway.extractKPCredentials();

        if (!kpCredentialsDTO.success) {
            // console.log(
            logger.info(
                `Failed to get KP credentials. Dumping DTO: ${kpCredentialsDTO.data.message}`
            );
            return {
                success: false,
                data: {
                    operation: "conversationRouter#list",
                    message: "Failed to get KP credentials",
                } as TBaseErrorDTOData
            };
        }

        const kernelSDK: TKernelSDK = serverContainer.get(KERNEL.KERNEL_SDK);

        const listConversationsViewModel = await kernelSDK.listConversations({
            id: input.id,
            xAuthToken: kpCredentialsDTO.data.xAuthToken,
        });

        if(listConversationsViewModel.status) {
            const conversations = listConversationsViewModel.conversations
            return {
                success: true,
                data: conversations,
            };
        }

        // console.log(
        logger.info(
            `Failed to get signed URL for upload. Dumping view model: ${listConversationsViewModel.errorMessage}`
        );
        return {
            success: false,
            data: {
                operation: "conversationRouter#list",
                message: `Failed to list messages for Research Context with ID ${input.id}`,
            } as TBaseErrorDTOData
        }; // TODO: clean this, return a proper error DTO or a view model probably

    }),

    create: protectedProcedure
        .input(
            z.object({
                id: z.number(),  // Research context ID
                title: z.string(),
            }),
        )
        .mutation(async ({ input }): Promise<{
            success: true,
            data: NewConversationViewModel
        } | {
            success: false,
            data: TBaseErrorDTOData
        }> => {

            const logger = getLogger();
            const authGateway = serverContainer.get<AuthGatewayOutputPort>(GATEWAYS.AUTH_GATEWAY);
            const kpCredentialsDTO = await authGateway.extractKPCredentials();

            if (!kpCredentialsDTO.success) {
                return {
                    success: false,
                    data: {
                        operation: "conversationRouter#create",
                        message: "Failed to get KP credentials",
                    } as TBaseErrorDTOData
                };
            }

            const kernelSDK: TKernelSDK = serverContainer.get(KERNEL.KERNEL_SDK);

            const newConversationViewModel = await kernelSDK.createConversation({
                id: input.id,
                xAuthToken: kpCredentialsDTO.data.xAuthToken,
                conversationTitle: input.title,
            });

            if(newConversationViewModel.status) {
                return {
                    success: true,
                    data: newConversationViewModel
                };
            }

            return {
                success: false,
                data: {
                    operation: "conversationRouter#create",
                    message: newConversationViewModel.errorMessage,
                } as TBaseErrorDTOData
            };
        }),
});