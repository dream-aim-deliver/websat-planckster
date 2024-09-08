import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../../server";
import serverContainer from "../../../config/ioc/server-container";
import { type Logger } from "pino";
import { GATEWAYS, UTILS } from "../../../config/ioc/server-ioc-symbols";
import type KernelSourceDataGateway from "../../../gateway/kernel-source-data-gateway";
import { type GetClientDataForDownloadDTO, type GetClientDataForUploadDTO, type NewSourceDataDTO } from "~/lib/infrastructure/common/dto/kernel-planckster-source-data-gateway-dto";

export const sourceDataRouter = createTRPCRouter({
  getClientDataForUpload: protectedProcedure
    .input(
      z.object({
        relativePath: z.string(),
      }),
    )
    .query(async ({ input }): Promise<GetClientDataForUploadDTO> => {
      const loggerFactory = serverContainer.get<(module: string) => Logger>(UTILS.LOGGER_FACTORY);

      const logger = loggerFactory("GetClientDataForUpload TRPC Router");

      try {
        const gateway = serverContainer.get<KernelSourceDataGateway>(GATEWAYS.KERNEL_SOURCE_DATA_GATEWAY);

        const dto = await gateway.getClientDataForUpload(input.relativePath);

        return dto;
      } catch (error) {
        logger.error({ error }, "Could not invoke the server side feature to get client data for upload");

        return {
          success: false,
          data: {
            operation: "sourceDataRouter#getClientDataForUpload",
            message: "Could not invoke the server side feature to get client data for upload",
          },
        };
      }
    }),

  getClientDataForDownload: protectedProcedure
    .input(
      z.object({
        relativePath: z.string(),
      }),
    )
    .query(async ({ input }): Promise<GetClientDataForDownloadDTO> => {
      const loggerFactory = serverContainer.get<(module: string) => Logger>(UTILS.LOGGER_FACTORY);

      const logger = loggerFactory("GetClientDataForDownload TRPC Router");

      try {
        const gateway = serverContainer.get<KernelSourceDataGateway>(GATEWAYS.KERNEL_SOURCE_DATA_GATEWAY);

        const dto = await gateway.getClientDataForDownload(input.relativePath);

        return dto;
      } catch (error) {
        logger.error({ error }, "Could not invoke the server side feature to get client data for download");

        return {
          success: false,
          data: {
            operation: "sourceDataRouter#getClientDataForDownload",
            message: "Could not invoke the server side feature to get client data for download",
          },
        };
      }
    }),

  newSourceData: protectedProcedure
    .input(
      z.object({
        sourceDataName: z.string(),
        relativePath: z.string(),
      }),
    )
    .mutation(async ({ input }): Promise<NewSourceDataDTO> => {
      const loggerFactory = serverContainer.get<(module: string) => Logger>(UTILS.LOGGER_FACTORY);

      const logger = loggerFactory("NewSourceData TRPC Router");

      try {
        const gateway = serverContainer.get<KernelSourceDataGateway>(GATEWAYS.KERNEL_SOURCE_DATA_GATEWAY);

        const dto = await gateway.newSourceData(input.sourceDataName, input.relativePath);

        return dto;
      } catch (error) {
        logger.error({ error }, "Could not invoke the server side feature to create new source data");

        return {
          success: false,
          data: {
            operation: "sourceDataRouter#newSourceData",
            message: "Could not invoke the server side feature to create new source data",
          },
        };
      }
    }),
});
