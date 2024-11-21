import { z } from "zod";

/**
 *  Base schemas for table rows
 */

export const ClimateRowSchema = z.object({
  id: z.string().uuid(),
  location: z.string().min(1),
  temperature: z.number().min(-100).max(100),
  humidity: z.number().min(0).max(100),
});
export type TClimateDatum = z.infer<typeof ClimateRowSchema>;

export const SentinelRowSchema = z.object({
  timestamp: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  CarbonMonoxideLevel: z.string(),
});
export type TSentinelDatum = z.infer<typeof SentinelRowSchema>;

export const CaseStudyRowSchema = z.union([ClimateRowSchema, SentinelRowSchema]);
export type TCaseStudyRow = z.infer<typeof CaseStudyRowSchema>;

/**
 * Base schemas for metadata coming from the secondary side
 */

export const KeyframeErrorSchema = z.object({
  errorName: z.string(),
  errorMessage: z.string(),
});
export type TKeyframeError = z.infer<typeof KeyframeErrorSchema>;

export const MetadataImageSchema = z.object({
  relativePath: z.string(),
  description: z.string(),
  kind: z.string(),
});
export type TMetadataImage = z.infer<typeof MetadataImageSchema>;

export const KeyframeImageSchema = z.object({
  relativePath: z.string(),
  description: z.string(),
  signedUrl: z.string().url(),
  kind: z.string(),
});
export type TKeyframeImage = z.infer<typeof KeyframeImageSchema>;

export const ClimateMetadatumSchema = z.object({
  timestamp: z.string(),
  images: z.array(MetadataImageSchema.or(KeyframeErrorSchema)),
  data: z.array(ClimateRowSchema.or(KeyframeErrorSchema)),
  dataDescription: z.string()
});
export type TClimateMetadata = z.infer<typeof ClimateMetadatumSchema>;

export const SentinelMetadatumSchema = z.object({
  timestamp: z.string(),
  images: z.array(MetadataImageSchema.or(KeyframeErrorSchema)),
  data: z.array(SentinelRowSchema.or(KeyframeErrorSchema)),
  dataDescription: z.string()
});
export type TSentinelMetadata = z.infer<typeof SentinelMetadatumSchema>;

export const ClimateCaseStudyMetadataSchema = z.object({
  caseStudy: z.literal("climate-monitoring"),
  relativePathsForAgent: z.array(z.string()),
  keyframes: z.array(ClimateMetadatumSchema),
  imageKinds: z.array(z.string())
});
export type TClimateCaseStudyMetadata = z.infer<typeof ClimateCaseStudyMetadataSchema>;

export const SentinelCaseStudyMetadataSchema = z.object({
  caseStudy: z.literal("sentinel-5p"),
  relativePathsForAgent: z.array(z.string()),
  keyframes: z.array(SentinelMetadatumSchema),
  imageKinds: z.array(z.string())
});
export type TSentinelCaseStudyMetadata = z.infer<typeof SentinelCaseStudyMetadataSchema>;

/**
 * Input from the secondary side to the case study repository
 */

export const CaseStudyMetadataSchema = z.discriminatedUnion("caseStudy", [ClimateCaseStudyMetadataSchema, SentinelCaseStudyMetadataSchema]);
export type TCaseStudyMetadata = z.infer<typeof CaseStudyMetadataSchema>;

/**
 *  Part of the input to the usecase from the repository, and part of the output from the usecase to the viewmodel
 */

export const ClimateKeyframeSchema = z.object({
  timestamp: z.string(),
  images: z.array(KeyframeImageSchema.or(KeyframeErrorSchema)),
  data: z.array(ClimateRowSchema.or(KeyframeErrorSchema)),
  dataDescription: z.string()
});
export type TClimateKeyframe = z.infer<typeof ClimateKeyframeSchema>;

export const SentinelKeyframeSchema = z.object({
  timestamp: z.string(),
  images: z.array(KeyframeImageSchema.or(KeyframeErrorSchema)),
  data: z.array(SentinelRowSchema.or(KeyframeErrorSchema)),
  dataDescription: z.string()
});
export type TSentinelKeyframe = z.infer<typeof SentinelKeyframeSchema>;

export const KeyframeSchema = z.union([ClimateKeyframeSchema, SentinelKeyframeSchema]);
export type TKeyframe = z.infer<typeof KeyframeSchema>;

/**
 * Part of the output from the usecase to the primary side
 */
export const ClimateKeyframeArraySchema = z.object({
  caseStudy: z.literal("climate-monitoring"),
  keyFrames: z.array(ClimateKeyframeSchema),
  expirationTime: z.number().int().positive(),
  imageKinds: z.array(z.string())
});
export type TClimateKeyframeArray = z.infer<typeof ClimateKeyframeArraySchema>;

export const SentinelKeyframeArraySchema = z.object({
  caseStudy: z.literal("sentinel-5p"),
  keyFrames: z.array(SentinelKeyframeSchema),
  expirationTime: z.number().int().positive(),
  imageKinds: z.array(z.string())
});
export type TSentinelKeyframeArray = z.infer<typeof SentinelKeyframeArraySchema>;

export const KeyframeArraySchema = z.discriminatedUnion("caseStudy", [ClimateKeyframeArraySchema, SentinelKeyframeArraySchema]);
export type TKeyframeArray = z.infer<typeof KeyframeArraySchema>;
