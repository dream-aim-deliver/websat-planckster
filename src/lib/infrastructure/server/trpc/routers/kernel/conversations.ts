import { z } from "zod";

import { type NewConversationViewModel, type ListConversationsViewModel } from "@maany_shr/kernel-planckster-sdk-ts";
import { createTRPCRouter, protectedProcedure } from "~/lib/infrastructure/server/trpc/server";
import type AuthGatewayOutputPort from "~/lib/core/ports/secondary/auth-gateway-output-port";
import type { TBaseErrorDTOData } from "~/sdk/core/dto";
import type { Logger } from "pino";
import serverContainer from "../../../config/ioc/server-container";
import { UTILS, GATEWAYS, KERNEL } from "../../../config/ioc/server-ioc-symbols";
import { type TKernelSDK } from "../../../config/kernel/kernel-sdk";

const getLogger = () => {
  const loggerFactory = serverContainer.get<(module: string) => Logger>(UTILS.LOGGER_FACTORY);
  const logger = loggerFactory("conversationRouter");
  return logger;
}

export const conversationRouter = createTRPCRouter({
    list: protectedProcedure
    .input(
        z.object({
            researchContextID: z.number(),
        }),
    )
    .query(async ({ input }): Promise<
        {
            success: true,
            data: ListConversationsViewModel
        } | {
            success: false,
            data: TBaseErrorDTOData
        } 
    > => {

        const logger = getLogger();
        const authGateway = serverContainer.get<AuthGatewayOutputPort>(GATEWAYS.AUTH_GATEWAY);
        const kpCredentialsDTO = await authGateway.extractKPCredentials();

        if (!kpCredentialsDTO.success) {
            logger.error(
                `Failed to get KP credentials: ${kpCredentialsDTO.data.message}`
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
            id: input.researchContextID,
            xAuthToken: kpCredentialsDTO.data.xAuthToken,
        });

        if(listConversationsViewModel.status) {
            logger.debug(`Successfully listed conversations for Research Context with ID ${input.researchContextID}. View model code: ${listConversationsViewModel.code}`);
            return {
                success: true,
                data: listConversationsViewModel,
            };
        }

        logger.error(
            `Failed to list conversations for Research Context with ID ${input.researchContextID}: ${listConversationsViewModel.errorMessage}`
        );
        return {
            success: false,
            data: {
                operation: "conversationRouter#list",
                message: `Failed to list messages for Research Context with ID ${input.researchContextID}`,
            } as TBaseErrorDTOData
        };

    }),

    create: protectedProcedure
        .input(
            z.object({
                researchContextID: z.number(),
                conversationTitle: z.string(),
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
                logger.error(
                    `Failed to get KP credentials: ${kpCredentialsDTO.data.message}`
                );
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
                id: input.researchContextID,
                xAuthToken: kpCredentialsDTO.data.xAuthToken,
                conversationTitle: input.conversationTitle,
            });

            if(newConversationViewModel.status) {
                logger.debug(`Successfully created conversation for Research Context with ID ${input.researchContextID}. View model code: ${newConversationViewModel.code}`);
                return {
                    success: true,
                    data: newConversationViewModel
                };
            }

            logger.error(`Failed to create conversation for Research Context with ID ${input.researchContextID}: ${newConversationViewModel.errorMessage}`);
            return {
                success: false,
                data: {
                    operation: "conversationRouter#create",
                    message: `Failed to create conversation for Research Context with ID ${input.researchContextID}`,
                } as TBaseErrorDTOData
            };
        }),
});