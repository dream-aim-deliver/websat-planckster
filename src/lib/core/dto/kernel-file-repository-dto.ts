import { type z } from "zod";
import { DTOSchemaFactory, BaseErrorDTOSchema } from "@/sdk/core/dto";
import { UploadSignedUrlSchema, DownloadSignedUrlSchema } from "../entity/signed-url";

export const getUploadSignedUrlDTOSchema = DTOSchemaFactory(UploadSignedUrlSchema, BaseErrorDTOSchema);
export type GetUploadSignedUrlDTO = z.infer<typeof getUploadSignedUrlDTOSchema>;

export const getDownloadSignedUrlDTOSchema = DTOSchemaFactory(DownloadSignedUrlSchema, BaseErrorDTOSchema);
export type GetDownloadSignedUrlDTO = z.infer<typeof getDownloadSignedUrlDTOSchema>;