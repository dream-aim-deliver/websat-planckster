import { z } from "zod";
import { ResearchContextSchema } from "../entity/kernel-models";
import { LocalFileSchema } from "../entity/file";

export const CaseStudyRequestViewModelSchema = z.object({
  status: z.enum(["request"]),
  caseStudyName: z.string(),
  tracerID: z.string(),
  jobID: z.string(),
});
export type TCaseStudyRequestViewModel = z.infer<typeof CaseStudyRequestViewModelSchema>;

export const CaseStudySuccessViewModelSchema = z.object({
  status: z.enum(["success"]),
  researchContext: ResearchContextSchema,
  mapLocalFiles: z.array(LocalFileSchema),
});
export type TCaseStudySuccessViewModel = z.infer<typeof CaseStudySuccessViewModelSchema>;

export const CaseStudyErrorViewModelSchema = z.object({
  status: z.enum(["error"]),
  message: z.string().optional(),
  context: z.any().optional(),
});
export type TCaseStudyErrorViewModel = z.infer<typeof CaseStudyErrorViewModelSchema>;

export const CaseStudyProgressViewModelSchema = z.object({
  status: z.enum(["progress"]),
  message: z.string().optional(),
  context: z.any().optional(),
});
export type TCaseStudyProgressViewModel = z.infer<typeof CaseStudyProgressViewModelSchema>;

export const CaseStudyViewModelSchema = z.discriminatedUnion("status", [CaseStudyRequestViewModelSchema, CaseStudySuccessViewModelSchema, CaseStudyErrorViewModelSchema, CaseStudyProgressViewModelSchema]);
export type TCaseStudyViewModel = z.infer<typeof CaseStudyViewModelSchema>;
