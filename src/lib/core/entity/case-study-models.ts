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
  timestamp: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  CarbonMonoxideLevel: z.string(),
  PredictedWeather: z.string(),
  ActualWeather: z.string(),
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
 * swissgrid
 */

const OnOffLiteral = z.enum(['ON', 'OFF']).transform(val => val.toUpperCase());

export const SwissGridRowSchema = z.object({
  model: z.string(),
  timestamp: z.string(),
  prediction: OnOffLiteral,
  confidence: z.number(),
});
export type TSwissGridRow = z.infer<typeof SwissGridRowSchema>;

export const SwissGridKeyframeSchema = z.object({
  timestamp: z.string(),
  images: z.array(ImageSchema.or(ErrorSchema)),
  data: z.array(SwissGridRowSchema.or(ErrorSchema)),
  dataDescription: z.string(),
});
export type TSwissGridKeyframe = z.infer<typeof SwissGridKeyframeSchema>;

export const SwissGridMetadataSchema = z.object({
  caseStudy: z.literal("swissgrid"),
  keyframes: z.array(SwissGridKeyframeSchema),
  imageKinds: z.array(z.string()),
  relativePathsForAgent: z.array(z.string()),
  expirationTime: z.number(),
});
export type TSwissGridMetadata = z.infer<typeof SwissGridMetadataSchema>;


/**
 * Case study metadata
 */

export const KeyframeArraySchema = z.array(ClimateKeyframeSchema).or(z.array(SentinelKeyframeSchema)).or(z.array(SwissGridKeyframeSchema));
export type TKeyframeArray = z.infer<typeof KeyframeArraySchema>;

export const CaseStudyMetadataSchema = z.discriminatedUnion("caseStudy", [ClimateMetadataSchema, SentinelMetadataSchema, SwissGridMetadataSchema]);

export type TCaseStudyMetadata = z.infer<typeof CaseStudyMetadataSchema>;

const ClimateMetadataWithoutRelativePathsSchema = ClimateMetadataSchema.omit({ relativePathsForAgent: true });
const SentinelMetadataWithoutRelativePathsSchema = SentinelMetadataSchema.omit({ relativePathsForAgent: true });
const SwissGridMetadataWithoutRelativePathsSchema = SwissGridMetadataSchema.omit({ relativePathsForAgent: true });

export const CaseStudyMetadataWithoutRelativePathsSchema = z.discriminatedUnion("caseStudy", [ClimateMetadataWithoutRelativePathsSchema, SentinelMetadataWithoutRelativePathsSchema, SwissGridMetadataWithoutRelativePathsSchema]);
export type TCaseStudyMetadataWithoutRelativePaths = z.infer<typeof CaseStudyMetadataWithoutRelativePathsSchema>;
