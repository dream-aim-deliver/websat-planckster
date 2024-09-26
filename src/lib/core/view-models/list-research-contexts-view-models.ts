import { z } from 'zod'
import { ResearchContextSchema } from '../entity/kernel-models'

export const ListResearchContextsRequestViewModelSchema = z.object({
    status: z.enum(["request"]),
})

export type TListResearchContextsRequestViewModel = z.infer<typeof ListResearchContextsRequestViewModelSchema>

export const ListResearchContextsSuccessViewModelSchema = z.object({
    status: z.enum(["success"]),
    researchContexts: z.array(ResearchContextSchema),
})
export type TListResearchContextsSuccessViewModel = z.infer<typeof ListResearchContextsSuccessViewModelSchema>

// export const ListResearchContextsPartialViewModelSchema = z.object({
//     status: z.enum(["partial"]),
//     success: z.array(ResearchContextSchema),
//     errors: z.array(z.object({
//         status: z.enum(["hopeless", "hope"]),
//         message: z.string(),
//     })
//     ),
// })
// export type TListResearchContextsPartialViewModel= z.infer<typeof ListResearchContextsPartialViewModelSchema>

export const ListResearchContextsErrorViewModelSchema = z.object({
    status: z.enum(["error"]),
    message: z.string(),
    context: z.any(),
})

export type TListResearchContextsErrorViewModel = z.infer<typeof ListResearchContextsErrorViewModelSchema>

export const ListResearchContextsViewModelSchema = z.discriminatedUnion("status", [
    ListResearchContextsRequestViewModelSchema,
    ListResearchContextsSuccessViewModelSchema,
    // ListResearchContextsPartialViewModelSchema,
    ListResearchContextsErrorViewModelSchema
])
export type TListResearchContextsViewModel = z.infer<typeof ListResearchContextsViewModelSchema>