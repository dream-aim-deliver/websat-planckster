import { z } from "zod";

import { DTOSchemaFactory, BaseErrorDTOSchema } from "@/sdk/core/dto";
import { FileSchema } from "../entity/file";

/**
 * Represents a list of source data DTOs.
 */
export const ListSourceDataDTOSchema = DTOSchemaFactory(
    z.array(FileSchema), 
    BaseErrorDTOSchema
);
export type ListSourceDataDTO = z.infer<typeof ListSourceDataDTOSchema>;

export const GetSourceDataDTOSchema = DTOSchemaFactory(FileSchema, BaseErrorDTOSchema);
export type GetSourceDataDTO = z.infer<typeof GetSourceDataDTOSchema>;

export const DeleteSourceDataDTOSchema = DTOSchemaFactory(FileSchema, BaseErrorDTOSchema);
export type DeleteSourceDataDTO = z.infer<typeof DeleteSourceDataDTOSchema>;
