 import { z } from "zod";
 import { BaseErrorDTOSchema, DTOSchemaFactory } from "~/sdk/core/dto";
import { VectorStoreSchema } from "../entity/dadbod/vector-store";


export const CreateVectorStoreDTOSchema = DTOSchemaFactory(z.object({}), BaseErrorDTOSchema);
export type CreateVectorStoreDTO = z.infer<typeof CreateVectorStoreDTOSchema>;

export const GetVectorStoreDTOSchema = DTOSchemaFactory(VectorStoreSchema, BaseErrorDTOSchema);
export type GetVectorStoreDTO = z.infer<typeof GetVectorStoreDTOSchema>;

export const DeleteVectorStoreDTOSchema = DTOSchemaFactory(z.object({}), BaseErrorDTOSchema);
export type DeleteVectorStoreDTO = z.infer<typeof DeleteVectorStoreDTOSchema>;

export const UpdateVectorStoreDTOSchema = DTOSchemaFactory(z.object({}), BaseErrorDTOSchema);
export type UpdateVectorStoreDTO = z.infer<typeof UpdateVectorStoreDTOSchema>;