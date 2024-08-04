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

export const ExtractKPCredentialsDTOSchema = DTOSchemaFactory(
    z.object({
        xAuthToken: z.string(),
        clientID: z.number(),
    }),
    z.object({
        message: z.string(),
    })
)

export type ExtractKPCredentialsDTO = z.infer<typeof ExtractKPCredentialsDTOSchema>;