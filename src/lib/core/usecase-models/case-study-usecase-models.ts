import { z } from "zod";
import { ConversationSchema, ResearchContextSchema } from "../entity/kernel-models";
import { KeyframeArraySchema } from "../entity/case-study-models";

export const CaseStudyRequestSchema = z.object({
  caseStudyName: z.string(),
  tracerID: z.string(),
  jobID: z.string(),
});
export type TCaseStudyRequest = z.infer<typeof CaseStudyRequestSchema>;

export const CaseStudySuccessResponseSchema = z.object({
  status: z.literal("success"),
  keyframeArray: KeyframeArraySchema,
  researchContext: ResearchContextSchema,
  conversation: ConversationSchema,
});
export type TCaseStudySuccessResponse = z.infer<typeof CaseStudySuccessResponseSchema>;

export const CaseStudyErrorResponseSchema = z.object({
  status: z.literal("error"),
  operation: z.string(),
  message: z.string(),
  context: z.any().optional(),
});
export type TCaseStudyErrorResponse = z.infer<typeof CaseStudyErrorResponseSchema>;

export const CaseStudyProgressResponseSchema = z.object({
  status: z.literal("progress"),
  message: z.string(),
  context: z.any().optional(),
});
export type TCaseStudyProgressResponse = z.infer<typeof CaseStudyProgressResponseSchema>;

export const CaseStudyResponseSchema = z.discriminatedUnion("status", [CaseStudySuccessResponseSchema, CaseStudyErrorResponseSchema, CaseStudyProgressResponseSchema]);
export type TCaseStudyResponse = z.infer<typeof CaseStudyResponseSchema>;
