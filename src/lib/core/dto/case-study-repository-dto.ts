import { type z } from "zod";
import { BaseErrorDTOSchema, DTOSchemaFactory } from "~/sdk/core/dto";
import { KeyframeArrayMetadataSchema } from "../entity/case-study-models";

export const GetCaseStudyMetadataDTOSchema = DTOSchemaFactory(KeyframeArrayMetadataSchema, BaseErrorDTOSchema);
export type GetCaseStudyMetadataDTO = z.infer<typeof GetCaseStudyMetadataDTOSchema>;
