import { z } from "zod";
import { MessageSchema } from "~/lib/core/entity/kernel-models";
import { BaseErrorDTOSchema, DTOSchemaFactory } from "~/sdk/core/dto";

export const OpenAIMessageContext = DTOSchemaFactory(z.object({
    assistantID: z.string(),
    messagesToSend: z.array(MessageSchema)
}), BaseErrorDTOSchema);

export type TOpenAIMessageContext = z.infer<typeof OpenAIMessageContext>;