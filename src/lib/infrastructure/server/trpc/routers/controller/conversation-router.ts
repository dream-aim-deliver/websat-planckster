import type { Logger } from "pino";
import { z } from "zod";
import type { TListConversationsViewModel } from "~/lib/core/view-models/list-conversations-view-model";
import serverContainer from "../../../config/ioc/server-container";
import { UTILS, CONTROLLERS } from "../../../config/ioc/server-ioc-symbols";
import type ListConversationsController from "../../../controller/list-conversations-controller";
import { createTRPCRouter, protectedProcedure } from "../../server";
import type { Signal } from "~/lib/core/entity/signals";
import signalsContainer from "~/lib/infrastructure/common/signals-container";
import { SIGNAL_FACTORY } from "~/lib/infrastructure/common/signals-ioc-container";

export const conversationRouter = createTRPCRouter({
    list: protectedProcedure
        .input(
            z.object({
                researchContextID: z.number(),
            })
        )
        .query(async ({ input }) => {
            const loggerFactory = serverContainer.get<(module: string) => Logger>(UTILS.LOGGER_FACTORY)
            const logger = loggerFactory("ListConversations TRPC Router")
            const signalFactory = signalsContainer.get<(initialValue: TListConversationsViewModel, update?: (value: TListConversationsViewModel) => void) => Signal<TListConversationsViewModel>>(SIGNAL_FACTORY.KERNEL_LIST_CONVERSATIONS)

            const response: Signal<TListConversationsViewModel> = signalFactory({
                status: "request",
            })

            try {
                const controller = serverContainer.get<ListConversationsController>(CONTROLLERS.LIST_CONVERSATIONS_CONTROLLER)
                await controller.execute({ response: response, researchContextID: input.researchContextID })
                return response;
            } catch (error) {
                response.update({
                    status: "error",
                    message: "Could not invoke the server side feature to list conversations",
                })
                logger.error({ error }, "Could not invoke the server side feature to list conversations")
                return response;
            }
        }),
})