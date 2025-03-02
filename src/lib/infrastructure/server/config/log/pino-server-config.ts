import pino, { type Logger } from "pino";

const rootLogger: Logger =
    process.env.NODE_ENV === "production"
        ? // JSON in production
        pino({ level: "warn" })
        : // Pretty print in development
        pino({
            transport: {
                target: "pino-pretty",
                options: {
                    colorize: true,
                },
            },
            level: "info",
        });

export default rootLogger;