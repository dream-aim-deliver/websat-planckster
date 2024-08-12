import { z } from "zod";
import { BaseErrorDTOSchema, DTOSchemaFactory } from "~/sdk/core/dto";
import { EmbeddingsSchema, VectorStoreSchema } from "../entity/dadbod/vector-store";


export const CreateVectorStoreDTOSchema = DTOSchemaFactory(z.object({
    provider: z.string(),
    id: z.string(),
    embeddings : z.array(EmbeddingsSchema).optional(),
}), BaseErrorDTOSchema);
export type TCreateVectorStoreDTO = z.infer<typeof CreateVectorStoreDTOSchema>;

export const GetVectorStoreDTOSchema = DTOSchemaFactory(
    VectorStoreSchema.merge(z.object({
        message: z.string().optional(),
        context: z.any().optional(),
    })), BaseErrorDTOSchema);
export type TGetVectorStoreDTO = z.infer<typeof GetVectorStoreDTOSchema>;


export const GetEmbeddingsDTOSchema = DTOSchemaFactory(EmbeddingsSchema, BaseErrorDTOSchema);
export type TGetEmbeddingsDTO = z.infer<typeof GetEmbeddingsDTOSchema>;


export const DeleteVectorStoreDTOSchema = DTOSchemaFactory(z.object({}), BaseErrorDTOSchema);
export type TDeleteVectorStoreDTO = z.infer<typeof DeleteVectorStoreDTOSchema>;
