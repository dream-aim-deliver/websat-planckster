import { z } from "zod";
import { RemoteFileSchema } from "../entity/file";

export const ListSourceDataRequestSchema = z.object({
  researchContextID: z.number().optional(),
});
export type TListSourceDataRequest = z.infer<typeof ListSourceDataRequestSchema>;

export const ListSourceDataSuccessResponseSchema = z.object({
  status: z.literal("success"),
  sourceData: z.array(RemoteFileSchema),
});
export type TListSourceDataSuccessResponse = z.infer<typeof ListSourceDataSuccessResponseSchema>;

export const ListSourceDataErrorResponseSchema = z.object({
  status: z.literal("error"),
  operation: z.string(),
  message: z.string(),
  context: z.any().optional(),
});
export type TListSourceDataErrorResponse = z.infer<typeof ListSourceDataErrorResponseSchema>;

export const ListSourceDataResponseSchema = z.discriminatedUnion("status", [ListSourceDataSuccessResponseSchema, ListSourceDataErrorResponseSchema]);

export type TListSourceDataResponse = z.infer<typeof ListSourceDataResponseSchema>;
