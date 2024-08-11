import { type Logger } from "pino";
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
            throw new Error("Not implemented");
        }),
    download: protectedProcedure
        .query(async () => {
            throw new Error("Not implemented");
        }),
    upload: protectedProcedure
        .mutation(async () => {
            throw new Error("Not implemented");
        }),
    createVectorStore: protectedProcedure
        .mutation(async () => {
            throw new Error("Not implemented");
        }),
    createAgent: protectedProcedure
        .mutation(async () => {
            throw new Error("Not implemented");
        }),
});