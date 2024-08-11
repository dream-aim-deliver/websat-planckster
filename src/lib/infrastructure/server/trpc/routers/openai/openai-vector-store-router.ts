import type { Logger } from "pino";
import { z } from "zod";
import serverContainer from "../../../config/ioc/server-container";
import { UTILS } from "../../../config/ioc/server-ioc-symbols";
import { createTRPCRouter, protectedProcedure } from "~/lib/infrastructure/server/trpc/server";

const getLogger = () => {
    const loggerFactory = serverContainer.get<(module: string) => Logger>(UTILS.LOGGER_FACTORY);
    const logger = loggerFactory("conversationRouter");
    return logger;
  }

export const openAIVectorStoreRouter = createTRPCRouter({
    
});