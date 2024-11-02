import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../../server";
import serverContainer from "../../../config/ioc/server-container";
import { type Logger } from "pino";
import { CONTROLLERS, UTILS } from "../../../config/ioc/server-ioc-symbols";
import signalsContainer from "~/lib/infrastructure/common/signals-container";
import { type TListMessagesForConversationViewModel } from "~/lib/core/view-models/list-messages-for-conversation-view-model";
import { type Signal } from "~/lib/core/entity/signals";
import { SIGNAL_FACTORY } from "~/lib/infrastructure/common/signals-ioc-container";
import type ListMessagesForConversationController from "../../../controller/list-messages-for-conversation-controller";

export const messageRouter = createTRPCRouter({
  list: protectedProcedure
    .input(
      z.object({
        conversationID: z.number(),
      }),
    )
    .query(async ({ input }) => {
      const loggerFactory = serverContainer.get<(module: string) => Logger>(UTILS.LOGGER_FACTORY);

      const logger = loggerFactory("ListMessages TRPC Router");

      const signalFactory = signalsContainer.get<(initialValue: TListMessagesForConversationViewModel, update?: (value: TListMessagesForConversationViewModel) => void) => Signal<TListMessagesForConversationViewModel>>(
        SIGNAL_FACTORY.KERNEL_LIST_MESSAGES_FOR_CONVERSATION,
      );

      const response: Signal<TListMessagesForConversationViewModel> = signalFactory({
        status: "request",
        conversationID: input.conversationID,
      });

      try {
        const controller = serverContainer.get<ListMessagesForConversationController>(CONTROLLERS.LIST_MESSAGES_CONTROLLER);

        await controller.execute({
          response: response,
          conversationID: input.conversationID,
        });

        return response;
      } catch (error) {
        response.update({
          status: "error",
          message: "Could not invoke the server side feature to list messages for conversation",
        });
        logger.error({ error }, "Could not invoke the server side feature to list messages for conversation");

        return response;
      }
    }),

});
