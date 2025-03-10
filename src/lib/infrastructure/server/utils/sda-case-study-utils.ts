import { z } from "zod";
import {
  ClimateMetadataSchema,
  SentinelMetadataSchema,
  SwissGridMetadataSchema,
} from "~/lib/core/entity/case-study-models";

/**
 * common
 */

export const generateMetadataRelativePath = (caseStudyName: string, tracerID: string, jobID: number) => {
  return `${caseStudyName}/${tracerID}/${jobID}/metadata.json`;
};


/**
 * climate-monitoring
 */

const RawClimateMetadataSchema = ClimateMetadataSchema.omit({
  expirationTime: true,
});

/**
 * sentinel-5P
 */

const RawSentinelMetadataSchema = SentinelMetadataSchema.omit({
  expirationTime: true,
});

/**
 * swissgrid
 */

const RawSwissGridMetadataSchema = SwissGridMetadataSchema.omit({
  expirationTime: true,
});

/**
 * types
 */

export const RawCaseStudyMetadataSchema = z.discriminatedUnion("caseStudy", [RawClimateMetadataSchema, RawSentinelMetadataSchema, RawSwissGridMetadataSchema]);
export type TRawCaseStudyMetadata = z.infer<typeof RawCaseStudyMetadataSchema>;
