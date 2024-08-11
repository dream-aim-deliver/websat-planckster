import { z } from "zod";
import { RemoteFileSchema } from "../entity/file";
import { ResearchContextSchema } from "../entity/kernel-models";

export const CreateResearchContextRequestSchema = z.object({
    title: z.string(),
    description: z.string(),
    sourceDataList: z.array(RemoteFileSchema),
});
export type TCreateResearchContextRequest = z.infer<typeof CreateResearchContextRequestSchema>;


export const CreateResearchContextSuccessResponseSchema = z.object({
    researchContext: ResearchContextSchema,
});
export type TCreateResearchContextSuccessResponse = z.infer<typeof CreateResearchContextSuccessResponseSchema>;

export const CreateResearchContextErrorResponseSchema = z.object({
    operation: z.string(),
    message: z.string(),
    context: z.any().optional(),
});
export type TCreateResearchContextErrorResponse = z.infer<typeof CreateResearchContextErrorResponseSchema>;

export const CreateResearchContextProgressResponseSchema = z.object({
    status: z.string(),
    message: z.string(),
    context: z.any().optional(),
});
export type TCreateResearchContextProgressResponse = z.infer<typeof CreateResearchContextProgressResponseSchema>;




