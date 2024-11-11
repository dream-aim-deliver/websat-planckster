import { z } from "zod";
import { BaseErrorDTOSchema, DTOSchemaFactory } from "~/sdk/core/dto";
import { LocalFileSchema } from "../entity/file";

export const GetCaseStudyMetadataDTOSchema = DTOSchemaFactory(
  z.object({
    mapSourceDataRelativePaths: z.array(z.string()),
    agentSourceDataRelativePath: z.string(),
  }),
  BaseErrorDTOSchema,
);
export type GetCaseStudyMetadataDTO = z.infer<typeof GetCaseStudyMetadataDTOSchema>;

export const DownloadMapFilesDTOSchema = DTOSchemaFactory(z.array(LocalFileSchema), BaseErrorDTOSchema);
export type DownloadMapFilesDTO = z.infer<typeof DownloadMapFilesDTOSchema>;
