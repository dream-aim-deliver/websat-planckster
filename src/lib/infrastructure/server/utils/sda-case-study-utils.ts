import { z } from "zod";
import { ClimateKeyframeSchema, ClimateMetadataSchema, ClimateRowSchema, ImageSchema, SentinelKeyframeSchema, SentinelMetadataSchema, SentinelRowSchema } from "~/lib/core/entity/case-study-models";

/**
 * common
 */

export const generateMetadataRelativePath = (caseStudyName: string, tracerID: string, jobID: number) => {
  return `${caseStudyName}/${tracerID}/${jobID}/metadata.json`;
};

export const RegisteredSDACaseStudyNameSchema = z.union([z.literal("climate-monitoring"), z.literal("sentinel-5p")]);
export type TRegisteredSDACaseStudyName = z.infer<typeof RegisteredSDACaseStudyNameSchema>;

export type TRowSchema = typeof ClimateRowSchema | typeof SentinelRowSchema;

// TODO: additional row schemas
export const caseStudyToSchema: Record<TRegisteredSDACaseStudyName, TRowSchema> = {
  "climate-monitoring": ClimateRowSchema,
  "sentinel-5p": SentinelRowSchema,
};

export const SDAImageSchema = ImageSchema.omit({
  signedUrl: true,
});

/**
 * climate-monitoring
 */

const SDAClimateKeyframeSchema = ClimateKeyframeSchema.omit({ images: true }).extend({
  images: z.array(SDAImageSchema),
});

const SDAClimateMetadataSchema = ClimateMetadataSchema.omit({
  keyframes: true,
  expirationTime: true,
}).extend({
  keyframes: z.array(SDAClimateKeyframeSchema),
  relativePathsForAgent: z.array(z.string()),
});

/**
 * sentinel-5P
 */

const SDASentinelKeyframeSchema = SentinelKeyframeSchema.omit({ images: true }).extend({
  images: z.array(SDAImageSchema),
});

const SDASentinelMetadataSchema = SentinelMetadataSchema.omit({
  keyframes: true,
  expirationTime: true,
}).extend({
  keyframes: z.array(SDASentinelKeyframeSchema),
  relativePathsForAgent: z.array(z.string()),
});

/**
 * types
 */

export const SDAKeyframeSchema = z.union([SDAClimateKeyframeSchema, SDASentinelKeyframeSchema]);
export type TSDAKeyframe = z.infer<typeof SDAKeyframeSchema>;

export const SDACaseStudyMetadataSchema = z.discriminatedUnion("caseStudy", [SDAClimateMetadataSchema, SDASentinelMetadataSchema]);
export type TSDACaseStudyMetadata = z.infer<typeof SDACaseStudyMetadataSchema>;
