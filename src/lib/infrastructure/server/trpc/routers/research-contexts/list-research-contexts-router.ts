import { type Logger } from "pino";
import serverContainer from "../../../config/ioc/server-container";
import { createTRPCRouter, protectedProcedure } from "../../server";
import { CONTROLLERS, UTILS } from "../../../config/ioc/server-ioc-symbols";
import { type TListResearchContextsViewModel } from "~/lib/core/view-models/list-research-contexts-view-models";
import { type Signal } from "~/lib/core/entity/signals";
import type ListResearchContextsController from "../../../controller/list-research-contexts-controller";
import { SIGNAL_FACTORY } from "~/lib/infrastructure/common/signals-ioc-container";
import signalsContainer from "~/lib/infrastructure/common/signals-container";

const getLogger = () => {
    const loggerFactory = serverContainer.get<(module: string) => Logger>(UTILS.LOGGER_FACTORY);
    const logger = loggerFactory("conversationRouter");
    return logger;
}

export const listResearchContextsRouter = createTRPCRouter({
    listAll: protectedProcedure
      .query(async () => {
        const loggerFactory = serverContainer.get<(module: string) => Logger>(UTILS.LOGGER_FACTORY);
        const logger = loggerFactory("List Research Contexts TRPC Router");

        const signalFactory = signalsContainer.get<(initialValue: TListResearchContextsViewModel, update?: (value: TListResearchContextsViewModel) => void) => Signal<TListResearchContextsViewModel>>(SIGNAL_FACTORY.KERNEL_LIST_RESEARCH_CONTEXTS);
        // call a server controller and usecase to fetch research contexts, try to fix any errors
        const response: Signal<TListResearchContextsViewModel> =signalFactory({
          status: "request"
        });
        const controller = serverContainer.get<ListResearchContextsController>(CONTROLLERS.LIST_RESEARCH_CONTEXTS_CONTROLLER)
        await controller.execute({
          response: response,
        })
        return response;
      })
});