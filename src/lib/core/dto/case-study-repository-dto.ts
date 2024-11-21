import { z } from "zod";
import { BaseErrorDTOSchema, DTOSchemaFactory } from "~/sdk/core/dto";

import { ClimateMetadataSchema, SentinelMetadataSchema } from "../entity/case-study-models";

const CaseStudyMetadataWithRelativePathsSchema = z.discriminatedUnion("caseStudy", [ClimateMetadataSchema, SentinelMetadataSchema]);

export const GetCaseStudyMetadataDTOSchema = DTOSchemaFactory(CaseStudyMetadataWithRelativePathsSchema, BaseErrorDTOSchema);

export type GetCaseStudyMetadataDTO = z.infer<typeof GetCaseStudyMetadataDTOSchema>;
