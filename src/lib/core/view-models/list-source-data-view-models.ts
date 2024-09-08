import { z } from "zod";
import { RemoteFileSchema } from "../entity/file";

export const ListSourceDataRequestViewModelSchema = z.object({
  status: z.enum(["request"]),
  researchContextID: z.number().optional(),
});

export type TListSourceDataRequestViewModel = z.infer<typeof ListSourceDataRequestViewModelSchema>;

export const ListSourceDataSuccessViewModelSchema = z.object({
  status: z.enum(["success"]),
  sourceData: z.array(RemoteFileSchema),
});
export type TListSourceDataSuccessViewModel = z.infer<typeof ListSourceDataSuccessViewModelSchema>;

export const ListSourceDataErrorViewModel = z.object({
  status: z.enum(["error"]),
  message: z.string(),
  context: z.any(),
});
export type TListSourceDataErrorViewModel = z.infer<typeof ListSourceDataErrorViewModel>;

export const ListSourceDataViewModelSchema = z.discriminatedUnion("status", [ListSourceDataRequestViewModelSchema, ListSourceDataSuccessViewModelSchema, ListSourceDataErrorViewModel]);
export type TListSourceDataViewModel = z.infer<typeof ListSourceDataViewModelSchema>;
