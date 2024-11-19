import { z } from "zod";
import { BaseErrorDTOSchema, DTOSchemaFactory } from "~/sdk/core/dto";
import { ClimateKeyframeArraySchema, DisasterKeyframeArraySchema } from "../entity/case-study-models";

export const DisasterMetadataSuccessDTOSchema = DisasterKeyframeArraySchema.extend({
  relativePathsForAgent: z.array(z.string()),
});

export const ClimateMetadataSuccessDTOSchema = ClimateKeyframeArraySchema.extend({
  relativePathsForAgent: z.array(z.string()),
});

export const CaseStudyMetadataSuccessDTOSchema = z.discriminatedUnion("caseStudy", [ClimateMetadataSuccessDTOSchema, DisasterMetadataSuccessDTOSchema]);

export const GetCaseStudyMetadataDTOSchema = DTOSchemaFactory(CaseStudyMetadataSuccessDTOSchema, BaseErrorDTOSchema);

export type GetCaseStudyMetadataDTO = z.infer<typeof GetCaseStudyMetadataDTOSchema>;
