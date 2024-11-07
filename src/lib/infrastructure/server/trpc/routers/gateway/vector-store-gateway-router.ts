import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../../server";
import { RemoteFileSchema } from "~/lib/core/entity/file";
import serverContainer from "../../../config/ioc/server-container";
import { type Logger } from "pino";
import { GATEWAYS, UTILS } from "../../../config/ioc/server-ioc-symbols";
import type OpenAIVectorStoreGateway from "../../../gateway/openai-vector-store-gateway";
import { type TCreateVectorStoreDTO } from "~/lib/core/dto/vector-store-dto";

export const vectorStoreGatewayRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        files: z.array(RemoteFileSchema),
      }),
    )
    .mutation(async ({ input }): Promise<TCreateVectorStoreDTO> => {
      const loggerFactory = serverContainer.get<(module: string) => Logger>(UTILS.LOGGER_FACTORY);
      const logger = loggerFactory("CreateVectorStore TRPC Router");

      try {
        const gateway = serverContainer.get<OpenAIVectorStoreGateway>(GATEWAYS.VECTOR_STORE_GATEWAY);
        const dto = await gateway.createVectorStore(input.files);
        return dto;
      } catch (error) {
        logger.error({ error }, "Could not invoke the server side feature to create vector store");
        return {
          success: false,
          data: {
            operation: "vectorStoreGatewayRouter#create",
            message: "Could not invoke the server side feature to create vector store",
          },
        };
      }
    }),
});
