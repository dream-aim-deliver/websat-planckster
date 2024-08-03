import { z } from "zod";
import { DTOSchemaFactory } from "@/sdk/core/dto";
import { SessionSchema } from "../entity/auth/session";

export const GetSessionDTOSchema = DTOSchemaFactory(
    SessionSchema,
    z.object({
        notFound: z.boolean(),
        message: z.string(),
    }),
)

export type GetSessionDTO = z.infer<typeof GetSessionDTOSchema>;