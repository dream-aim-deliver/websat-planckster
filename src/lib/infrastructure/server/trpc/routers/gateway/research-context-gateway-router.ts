import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../../server";
import type { TCreateResearchContextDTO } from "~/lib/core/dto/research-context-gateway-dto";
import type { Logger } from "pino";
import serverContainer from "../../../config/ioc/server-container";
import { GATEWAYS, UTILS } from "../../../config/ioc/server-ioc-symbols";
import type KernelResearchContextGateway from "../../../gateway/kernel-research-context-gateway";
import { RemoteFileSchema } from "~/lib/core/entity/file";

export const researchContextGatewayRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        externalID: z.string(),
        title: z.string(),
        description: z.string(),
        sourceData: z.array(RemoteFileSchema),
      }),
    )
    .mutation(async ({ input }): Promise<TCreateResearchContextDTO> => {
      const loggerFactory = serverContainer.get<(module: string) => Logger>(UTILS.LOGGER_FACTORY);
      const logger = loggerFactory("CreateResearchContext TRPC Router");

      try {
        const gateway = serverContainer.get<KernelResearchContextGateway>(GATEWAYS.RESEARCH_CONTEXT_GATEWAY);
        const dto = await gateway.create(input.externalID, input.title, input.description, input.sourceData);
        return dto;
      } catch (error) {
        logger.error({ error }, "Could not invoke the server side feature to create research context");
        return {
          success: false,
          data: {
            operation: "researchContextGatewayRouter#create",
            message: "Could not invoke the server side feature to create research context",
          },
        };
      }
    }),
});
