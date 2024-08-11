import { z } from "zod";
import { ResearchContextSchema } from "../entity/kernel-models";

export const ListResearchContextsRequestSchema = z.object({
    clientID: z.string(),
});

export type TListResearchContextsRequest = z.infer<typeof ListResearchContextsRequestSchema>;

export const ListResearchContextsSuccessResponseSchema = z.object({
    researchContexts: z.array(ResearchContextSchema),
});

export type TListResearchContextsSuccessResponse = z.infer<typeof ListResearchContextsSuccessResponseSchema>;

export const ListResearchContextsErrorResponseSchema = z.object({
    operation: z.string(),
    message: z.string(),
    context: z.any().optional(),
});

export type TListResearchContextsErrorResponse = z.infer<typeof ListResearchContextsErrorResponseSchema>;

export const ListResearchContextsPartialResponseSchema = z.object({
    researchContexts: z.array(ResearchContextSchema),
    errors: z.array(z.object({
        operation: z.string(),
        status: z.enum(["hopeless", "hope"]),
        message: z.string(),
        context: z.any().optional(),
    })),
});
export type TListResearchContextsPartialResponse = z.infer<typeof ListResearchContextsPartialResponseSchema>;

