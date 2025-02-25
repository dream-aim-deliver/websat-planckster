import { z } from "zod";
import {
  ClimateKeyframeSchema,
  ClimateMetadataSchema,
  ClimateRowSchema, ErrorSchema,
  ImageSchema,
  SentinelKeyframeSchema,
  SentinelMetadataSchema,
  SentinelRowSchema, SwissGridKeyframeSchema, SwissGridMetadataSchema,
  SwissGridRowSchema
} from "~/lib/core/entity/case-study-models";

/**
 * common
 */

export const generateMetadataRelativePath = (caseStudyName: string, tracerID: string, jobID: number) => {
  return `${caseStudyName}/${tracerID}/${jobID}/metadata.json`;
};

export const RawImageSchema = ImageSchema.omit({
  signedUrl: true,
});

/**
 * climate-monitoring
 */

const RawClimateKeyframeSchema = ClimateKeyframeSchema.omit({ images: true }).extend({
  images: z.array(RawImageSchema.or(ErrorSchema)),
});
const RawClimateMetadataSchema = ClimateMetadataSchema.omit({
  keyframes: true,
  expirationTime: true,
}).extend({
  keyframes: z.array(RawClimateKeyframeSchema),
});

/**
 * sentinel-5P
 */

const RawSentinelKeyframeSchema = SentinelKeyframeSchema.omit({ images: true }).extend({
  images: z.array(RawImageSchema.or(ErrorSchema)),
});

const RawSentinelMetadataSchema = SentinelMetadataSchema.omit({
  keyframes: true,
  expirationTime: true,
}).extend({
  keyframes: z.array(RawSentinelKeyframeSchema),
});

/**
 * swissgrid
 */

const RawSwissGridKeyframeSchema = SwissGridKeyframeSchema.omit({ images: true }).extend({
  images: z.array(RawImageSchema.or(ErrorSchema)),
});

const RawSwissGridMetadataSchema = SwissGridMetadataSchema.omit({
  keyframes: true,
  expirationTime: true,
}).extend({
  keyframes: z.array(RawSwissGridKeyframeSchema),
});

/**
 * types
 */

export const RawKeyframeSchema = z.union([RawClimateKeyframeSchema, RawSentinelKeyframeSchema, RawSwissGridKeyframeSchema]);
export type TRawKeyframe = z.infer<typeof RawKeyframeSchema>;

export const RawCaseStudyMetadataSchema = z.discriminatedUnion("caseStudy", [RawClimateMetadataSchema, RawSentinelMetadataSchema, RawSwissGridMetadataSchema]);
export type TRawCaseStudyMetadata = z.infer<typeof RawCaseStudyMetadataSchema>;
