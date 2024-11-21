import { z } from "zod";

/**
 * Common
 */

export const ErrorSchema = z.object({
  errorName: z.string(),
  errorMessage: z.string(),
});
export type TError = z.infer<typeof ErrorSchema>;

export const ImageSchema = z.object({
  relativePath: z.string(),
  description: z.string(),
  signedUrl: z.string().url(),
  kind: z.string(),
});
export type TImage = z.infer<typeof ImageSchema>;

/**
 *  climate-monitoring
 */

export const ClimateRowSchema = z.object({
  id: z.string().uuid(),
  location: z.string().min(1),
  temperature: z.number().min(-100).max(100),
  humidity: z.number().min(0).max(100),
});
export type TClimateRow = z.infer<typeof ClimateRowSchema>;

export const ClimateKeyframeSchema = z.object({
  timestamp: z.string(),
  images: z.array(ImageSchema.or(ErrorSchema)),
  data: z.array(ClimateRowSchema.or(ErrorSchema)),
  dataDescription: z.string(),
});
export type TClimateKeyframe = z.infer<typeof ClimateKeyframeSchema>;

export const ClimateMetadataSchema = z.object({
  caseStudy: z.literal("climate-monitoring"),
  keyframes: z.array(ClimateKeyframeSchema),
  imageKinds: z.array(z.string()),
  relativePathsForAgent: z.array(z.string()),
  expirationTime: z.number(),
});
export type TClimateMetadata = z.infer<typeof ClimateMetadataSchema>;

/**
 * sentinel-5P
 */

export const SentinelRowSchema = z.object({
  timestamp: z.string(), // TODO: TBD if a timestamp is needed here too
  latitude: z.number(),
  longitude: z.number(),
  CarbonMonoxideLevel: z.string(),
});
export type TSentinelRow = z.infer<typeof SentinelRowSchema>;

export const SentinelKeyframeSchema = z.object({
  timestamp: z.string(),
  images: z.array(ImageSchema.or(ErrorSchema)),
  data: z.array(SentinelRowSchema.or(ErrorSchema)),
  dataDescription: z.string(),
});
export type TSentinelKeyframe = z.infer<typeof SentinelKeyframeSchema>;

export const SentinelMetadataSchema = z.object({
  caseStudy: z.literal("sentinel-5p"),
  keyframes: z.array(SentinelKeyframeSchema),
  imageKinds: z.array(z.string()),
  relativePathsForAgent: z.array(z.string()),
  expirationTime: z.number(),
});
export type TSentinelMetadata = z.infer<typeof SentinelMetadataSchema>;

/**
 * Case study metadata
 */

export const KeyframeArraySchema = z.array(ClimateKeyframeSchema).or(z.array(SentinelKeyframeSchema));
export type TKeyframeArray = z.infer<typeof KeyframeArraySchema>;

export const CaseStudyMetadataSchema = z.discriminatedUnion("caseStudy", [ClimateMetadataSchema, SentinelMetadataSchema]);

export type TCaseStudyMetadata = z.infer<typeof CaseStudyMetadataSchema>;

const ClimateMetadataWithoutRelativePathsSchema = ClimateMetadataSchema.omit({ relativePathsForAgent: true });
const SentinelMetadataWithoutRelativePathsSchema = SentinelMetadataSchema.omit({ relativePathsForAgent: true });

export const CaseStudyMetadataWithoutRelativePathsSchema = z.discriminatedUnion("caseStudy", [ClimateMetadataWithoutRelativePathsSchema, SentinelMetadataWithoutRelativePathsSchema]);
export type TCaseStudyMetadataWithoutRelativePaths = z.infer<typeof CaseStudyMetadataWithoutRelativePathsSchema>;
