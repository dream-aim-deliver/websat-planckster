import { Logger } from "pino";
import serverContainer from "../../../config/ioc/server-container";
import { UTILS } from "../../../config/ioc/server-ioc-symbols";
import { createTRPCRouter, protectedProcedure } from "../../server";

const getLogger = () => {
    const loggerFactory = serverContainer.get<(module: string) => Logger>(UTILS.LOGGER_FACTORY);
    const logger = loggerFactory("conversationRouter");
    return logger;
}

export const createResearchContextsRouter = createTRPCRouter({
    createInKernel: protectedProcedure
        .mutation(async () => {
        }),
    download: protectedProcedure
        .query(async () => {
        }),
    upload: protectedProcedure
        .mutation(async () => {
        }),
    createVectorStore: protectedProcedure
        .mutation(async () => {
        }),
    createAgent: protectedProcedure
        .mutation(async () => {
        }),

});