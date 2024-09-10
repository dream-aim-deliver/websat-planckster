import { z } from "zod";
import { ResearchContextSchema } from "../entity/kernel-models";

export const ListResearchContextsRequestSchema = z.object({
    status: z.literal("request"),
});

export type TListResearchContextsRequest = z.infer<typeof ListResearchContextsRequestSchema>;

export const ListResearchContextsSuccessResponseSchema = z.object({
    status: z.literal("success"),
    researchContexts: z.array(ResearchContextSchema),
});

export type TListResearchContextsSuccessResponse = z.infer<typeof ListResearchContextsSuccessResponseSchema>;

export const ListResearchContextsErrorResponseSchema = z.object({
    status: z.literal("error"),
    operation: z.string(),
    message: z.string(),
    context: z.any().optional(),
});

export type TListResearchContextsErrorResponse = z.infer<typeof ListResearchContextsErrorResponseSchema>;

export const ListResearchContextsPartialResponseSchema = z.object({
    status: z.literal("partial"),
    researchContexts: z.array(ResearchContextSchema),
    errors: z.array(z.object({
        operation: z.string(),
        status: z.enum(["hopeless", "hope"]),
        message: z.string(),
        context: z.any().optional(),
    })),
});
export type TListResearchContextsPartialResponse = z.infer<typeof ListResearchContextsPartialResponseSchema>;

export const ListResearchContextsResponseSchema = z.discriminatedUnion("status", [
    ListResearchContextsSuccessResponseSchema,
    ListResearchContextsErrorResponseSchema,
    ListResearchContextsPartialResponseSchema,
]);
export type TListResearchContextsResponse = z.infer<typeof ListResearchContextsResponseSchema>;
