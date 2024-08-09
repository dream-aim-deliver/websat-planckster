import type { z } from "zod";
import { DTOSchemaFactory, BaseErrorDTOSchema } from "@/sdk/core/dto";
import { LocalFileSchema, RemoteFileSchema } from "../entity/file";

export const UploadFileDTOSchema = DTOSchemaFactory(RemoteFileSchema, BaseErrorDTOSchema);
export type UploadFileDTO = z.infer<typeof UploadFileDTOSchema>;

export const DownloadFileDTOSchema = DTOSchemaFactory(LocalFileSchema, BaseErrorDTOSchema);
export type DownloadFileDTO = z.infer<typeof DownloadFileDTOSchema>;
