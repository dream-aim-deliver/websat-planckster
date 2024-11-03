import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../../server";
import serverContainer from "../../../config/ioc/server-container";
import { type Logger } from "pino";
import { CONTROLLERS, UTILS } from "../../../config/ioc/server-ioc-symbols";
import signalsContainer from "~/lib/infrastructure/common/signals-container";
import { type TListSourceDataViewModel } from "~/lib/core/view-models/list-source-data-view-models";
import { type Signal } from "~/lib/core/entity/signals";
import { SIGNAL_FACTORY } from "~/lib/infrastructure/common/signals-ioc-container";
import type ListSourceDataController from "../../../controller/list-source-data-controller";

export const sourceDataControllerRouter = createTRPCRouter({
  list: protectedProcedure
    .input(
      z.object({
        researchContextID: z.number().optional(),
      }),
    )
    .query(async ({ input }) => {
      const loggerFactory = serverContainer.get<(module: string) => Logger>(UTILS.LOGGER_FACTORY);

      const logger = loggerFactory("ListMessages TRPC Router");

      const signalFactory = signalsContainer.get<(initialValue: TListSourceDataViewModel, update?: (value: TListSourceDataViewModel) => void) => Signal<TListSourceDataViewModel>>(SIGNAL_FACTORY.KERNEL_LIST_SOURCE_DATA);

      const response: Signal<TListSourceDataViewModel> = signalFactory({
        status: "request",
        researchContextID: input.researchContextID,
      });

      try {
        const controller = serverContainer.get<ListSourceDataController>(CONTROLLERS.LIST_SOURCE_DATA_CONTROLLER);

        await controller.execute({
          response: response,
          researchContextID: input.researchContextID,
        });

        return response;
      } catch (error) {
        response.update({
          status: "error",
          message: "Could not invoke the server side feature to list source data",
        });
        logger.error({ error }, "Could not invoke the server side feature to list source data");

        return response;
      }
    }),
});
