import { z } from "zod";

import { DTOSchemaFactory, BaseErrorDTOSchema } from "@/sdk/core/dto";
import { FileSchema, RemoteFileSchema } from "../entity/file";

/**
 * Represents a list of source data DTOs.
 */
export const ListSourceDataDTOSchema = DTOSchemaFactory(z.array(FileSchema), BaseErrorDTOSchema);
export type ListSourceDataDTO = z.infer<typeof ListSourceDataDTOSchema>;

export const UploadSourceDataDTOSchema = DTOSchemaFactory(RemoteFileSchema, BaseErrorDTOSchema);
export type UploadSourceDataDTO = z.infer<typeof UploadSourceDataDTOSchema>;

export const DownloadSourceDataDTOSchema = DTOSchemaFactory(FileSchema, BaseErrorDTOSchema);
export type DownloadSourceDataDTO = z.infer<typeof DownloadSourceDataDTOSchema>;

export const GetSourceDataDTOSchema = DTOSchemaFactory(RemoteFileSchema, BaseErrorDTOSchema);
export type GetSourceDataDTO = z.infer<typeof GetSourceDataDTOSchema>;

export const DeleteSourceDataDTOSchema = DTOSchemaFactory(
  z.object({
    message: z.string().optional(),
  }),
  BaseErrorDTOSchema,
);
export type DeleteSourceDataDTO = z.infer<typeof DeleteSourceDataDTOSchema>;
