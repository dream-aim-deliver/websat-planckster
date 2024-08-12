import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/lib/infrastructure/server/trpc/server";
import serverContainer from "../../../config/ioc/server-container";
import { CONTROLLERS } from "../../../config/ioc/server-ioc-symbols";
import type CreateConversationController from "../../../controller/create-conversation-controller";
import type { TCreateConversationViewModel } from "~/lib/core/view-models/create-conversation-view-model";
import type { TListConversationsViewModel } from "~/lib/core/view-models/list-conversations-view-model";
import type ListConversationsController from "../../../controller/list-conversations-controller";


export const conversationRouter = createTRPCRouter({

    list: protectedProcedure
    .input(
        z.object({
            researchContextID: z.number(),
        }),
    )
    .query(async ({ input }): Promise<TListConversationsViewModel> => {

        const listConversationController = serverContainer.get<ListConversationsController>(CONTROLLERS.CREATE_CONVERSATION_CONTROLLER);
        const viewModel: TListConversationsViewModel = {
            status: "request",
        }
        await listConversationController.execute({
            response: viewModel,
            researchContextID: input.researchContextID.toString(),
        });

        return viewModel;

    }),


    create: protectedProcedure
        .input(
            z.object({
                researchContextID: z.number(),
                conversationTitle: z.string(),
            }),
        )
        .mutation(async ({ input }): Promise<TCreateConversationViewModel> => {

            const response: TCreateConversationViewModel = {
                status: "request",
                conversationTitle: input.conversationTitle,
            };
            const createConversationController = serverContainer.get<CreateConversationController>(CONTROLLERS.CREATE_CONVERSATION_CONTROLLER);
            await createConversationController.execute({
                response: response,
                researchContextID: input.researchContextID.toString(),
                title: input.conversationTitle,
            });

            return response;
        }),

});