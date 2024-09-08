import { z } from "zod";

import { DTOSchemaFactory, BaseErrorDTOSchema } from "@/sdk/core/dto";
import { RemoteFileSchema } from "~/lib/core/entity/file";


export const GetClientDataForUploadDTOSchema = DTOSchemaFactory(z.string(), BaseErrorDTOSchema);
export type GetClientDataForUploadDTO = z.infer<typeof GetClientDataForUploadDTOSchema>;

export const GetClientDataForDownloadDTOSchema = DTOSchemaFactory(z.string(), BaseErrorDTOSchema);
export type GetClientDataForDownloadDTO = z.infer<typeof GetClientDataForDownloadDTOSchema>;
 
export const NewSourceDataDTOSchema = DTOSchemaFactory(RemoteFileSchema, BaseErrorDTOSchema);
export type NewSourceDataDTO = z.infer<typeof NewSourceDataDTOSchema>;