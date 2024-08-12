import { z } from "zod";
import { DTOSchemaFactory, BaseErrorDTOSchema } from "~/sdk/core/dto";
export const SignedURLDTOSchema = DTOSchemaFactory(
    z.object({
        signedURL: z.string(),
    }),
    BaseErrorDTOSchema
);
export type TSignedURLDTO = z.infer<typeof SignedURLDTOSchema>;