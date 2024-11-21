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

export const DisasterRowSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  dateOccurred: z.date(),
  affectedPopulation: z.number().nonnegative().optional(),
});
export type TDisasterDatum = z.infer<typeof DisasterRowSchema>;

export const CaseStudyRowSchema = z.union([ClimateRowSchema, DisasterRowSchema]);
export type TCaseStudyRow = z.infer<typeof CaseStudyRowSchema>;

/**
 * Base schemas for metadata coming from the secondary side
 */

export const ImageErrorSchema = z.object({
  errorName: z.string(),
  errorMessage: z.string(),
});
export type TImageError = z.infer<typeof ImageErrorSchema>;

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
  images: z.array(MetadataImageSchema.or(ImageErrorSchema)),
  data: z.array(ClimateRowSchema),
});
export type TClimateMetadata = z.infer<typeof ClimateMetadatumSchema>;

export const DisasterMetadatumSchema = z.object({
  timestamp: z.string(),
  images: z.array(MetadataImageSchema.or(ImageErrorSchema)),
  data: z.array(DisasterRowSchema),
});
export type TDisasterMetadata = z.infer<typeof DisasterMetadatumSchema>;

export const ClimateCaseStudyMetadataSchema = z.object({
  caseStudy: z.literal("climate-monitoring"),
  relativePathsForAgent: z.array(z.string()),
  data: z.array(ClimateMetadatumSchema),
});
export type TClimateCaseStudyMetadata = z.infer<typeof ClimateCaseStudyMetadataSchema>;

export const DisasterCaseStudyMetadataSchema = z.object({
  caseStudy: z.literal("disaster-tracking"),
  relativePathsForAgent: z.array(z.string()),
  data: z.array(DisasterMetadatumSchema),
});
export type TDisasterCaseStudyMetadata = z.infer<typeof DisasterCaseStudyMetadataSchema>;

/**
 * Input from the secondary side to the case study repository
 */

export const CaseStudyMetadataSchema = z.discriminatedUnion("caseStudy", [ClimateCaseStudyMetadataSchema, DisasterCaseStudyMetadataSchema]);
export type TCaseStudyMetadata = z.infer<typeof CaseStudyMetadataSchema>;

/**
 *  Part of the input to the usecase from the repository, and part of the output from the usecase to the viewmodel
 */

export const ClimateKeyframeSchema = z.object({
  timestamp: z.string(),
  images: z.array(KeyframeImageSchema.or(ImageErrorSchema)),
  data: z.array(ClimateRowSchema),
});
export type TClimateKeyframe = z.infer<typeof ClimateKeyframeSchema>;

export const DisasterKeyframeSchema = z.object({
  timestamp: z.string(),
  images: z.array(KeyframeImageSchema.or(ImageErrorSchema)),
  data: z.array(DisasterRowSchema),
});
export type TDisasterKeyframe = z.infer<typeof DisasterKeyframeSchema>;

export const KeyframeSchema = z.union([ClimateKeyframeSchema, DisasterKeyframeSchema]);
export type TKeyframe = z.infer<typeof KeyframeSchema>;

/**
 * Part of the output from the usecase to the primary side
 */
export const ClimateKeyframeArraySchema = z.object({
  caseStudy: z.literal("climate-monitoring"),
  keyFrames: z.array(ClimateKeyframeSchema),
  expirationTime: z.number().int().positive(),
});
export type TClimateKeyframeArray = z.infer<typeof ClimateKeyframeArraySchema>;

export const DisasterKeyframeArraySchema = z.object({
  caseStudy: z.literal("disaster-tracking"),
  keyFrames: z.array(DisasterKeyframeSchema),
  expirationTime: z.number().int().positive(),
});
export type TDisasterKeyframeArray = z.infer<typeof DisasterKeyframeArraySchema>;

export const KeyframeArraySchema = z.discriminatedUnion("caseStudy", [ClimateKeyframeArraySchema, DisasterKeyframeArraySchema]);
export type TKeyframeArray = z.infer<typeof KeyframeArraySchema>;
