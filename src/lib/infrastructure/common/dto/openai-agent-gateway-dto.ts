import { z } from "zod";
import { BaseErrorDTOSchema, DTOSchemaFactory } from "~/sdk/core/dto";

export const OpenAIMessageContext = DTOSchemaFactory(z.object({
    threadID: z.string(),
}), BaseErrorDTOSchema);

export type TOpenAIMessageContext = z.infer<typeof OpenAIMessageContext>;