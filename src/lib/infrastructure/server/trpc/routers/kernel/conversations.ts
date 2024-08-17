import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/lib/infrastructure/server/trpc/server";
import serverContainer from "../../../config/ioc/server-container";
import { CONTROLLERS } from "../../../config/ioc/server-ioc-symbols";
import type CreateConversationController from "../../../controller/create-conversation-controller";
import { type TCreateConversationViewModel } from "~/lib/core/view-models/create-conversation-view-model";
import type ListConversationsController from "../../../controller/list-conversations-controller";
import { type TListConversationsViewModel } from "~/lib/core/view-models/list-conversations-view-model";

export const conversationRouter = createTRPCRouter({
  /**
   * NOTE: this is a controller-to-controller router function, so it pipes a view model
   */
  list: protectedProcedure
    .input(
      z.object({
        researchContextID: z.number(),
      }),
    )
    .query(async ({ input }): Promise<TListConversationsViewModel> => {
      const listConversationsController = serverContainer.get<ListConversationsController>(CONTROLLERS.LIST_CONVERSATIONS_CONTROLLER);

      const viewModel = await listConversationsController.execute({
        researchContextID: input.researchContextID,
      });

      return viewModel;

    }),

  /**
   * NOTE: this is a controller-to-controller router function, so it pipes a view model
   */
  create: protectedProcedure
    .input(
      z.object({
        researchContextID: z.number(),
        conversationTitle: z.string(),
      }),
    )
    .mutation(async ({ input }): Promise<TCreateConversationViewModel> => {
      const createConversationController = serverContainer.get<CreateConversationController>(CONTROLLERS.CREATE_CONVERSATION_CONTROLLER);

      const viewModel = await createConversationController.execute({
        researchContextID: input.researchContextID,
        title: input.conversationTitle,
      });

      return viewModel;
    }),
});
