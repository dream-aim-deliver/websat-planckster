import { type Logger } from "pino";
import serverContainer from "../../../config/ioc/server-container";
import { createTRPCRouter, protectedProcedure } from "../../server";
import { CONTROLLERS, UTILS } from "../../../config/ioc/server-ioc-symbols";
import { type TListResearchContextsViewModel } from "~/lib/core/view-models/list-research-contexts-view-models";
import { type Signal } from "~/lib/core/entity/signals";
import type ListResearchContextsController from "../../../controller/list-research-contexts-controller";
import { SIGNAL_FACTORY } from "~/lib/infrastructure/common/signals-ioc-container";
import signalsContainer from "~/lib/infrastructure/common/signals-container";

export const researchContextControllerRouter = createTRPCRouter({
  list: protectedProcedure.query(async () => {
    const loggerFactory = serverContainer.get<(module: string) => Logger>(UTILS.LOGGER_FACTORY);
    const logger = loggerFactory("ListResearchContexts TRPC Router");

    const signalFactory = signalsContainer.get<(initialValue: TListResearchContextsViewModel, update?: (value: TListResearchContextsViewModel) => void) => Signal<TListResearchContextsViewModel>>(SIGNAL_FACTORY.KERNEL_LIST_RESEARCH_CONTEXTS);

    const response: Signal<TListResearchContextsViewModel> = signalFactory({
      status: "request",
    });
    try {
      const controller = serverContainer.get<ListResearchContextsController>(CONTROLLERS.LIST_RESEARCH_CONTEXTS_CONTROLLER);
      await controller.execute({
        response: response,
      });

      return response;
    } catch (error) {
      response.update({
        status: "error",
        message: "Could not invoke the server side feature to list research contexts",
      });
      logger.error({ error }, "Could not invoke the server side feature to list research contexts");
      return response;
    }
  }),
});
