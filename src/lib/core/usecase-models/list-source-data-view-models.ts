import { z } from 'zod'
import { RemoteFileSchema } from '../entity/file'

export const ListSourceDataRequestSchema = z.object({
    clientID: z.string(),
    researchContextID: z.string().optional(),
})
export type TListSourceDataRequest = z.infer<typeof ListSourceDataRequestSchema>

export const ListSourceDataSuccessResponseSchema = z.object({
    sourceData: z.array(RemoteFileSchema),
})
export type TListSourceDataSuccessResponse = z.infer<typeof ListSourceDataSuccessResponseSchema>

export const ListSourceDataErrorResponseSchema = z.object({
    operation: z.string(),
    message: z.string(),
    context: z.any().optional(),
})
export type TListSourceDataErrorResponse = z.infer<typeof ListSourceDataErrorResponseSchema>
