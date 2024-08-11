import { z } from "zod";
import { RemoteFileSchema } from "../entity/file";

export const ListSourceDataRequestSchema = z.object({
    status: z.enum(["request"]),
});

export type TListSourceDataRequest = z.infer<typeof ListSourceDataRequestSchema>;

export const ListSourceDataSuccessViewModelSchema = z.object({
    status: z.enum(["success"]),
    sourceData: z.array(RemoteFileSchema)
});
export type TListSourceDataSuccessViewModel = z.infer<typeof ListSourceDataSuccessViewModelSchema>;

export const  ListSourceDataErrorViewModel = z.object({
    status: z.enum(["error"]),
    message: z.string(),
    context: z.any()
});
export type TListSourceDataErrorViewModel = z.infer<typeof ListSourceDataErrorViewModel>;

export const ListSourceDataViewModelSchema = z.discriminatedUnion("status", [
    ListSourceDataRequestSchema,
    ListSourceDataSuccessViewModelSchema,
    ListSourceDataErrorViewModel
]);
export type TListSourceDataViewModel = z.infer<typeof ListSourceDataViewModelSchema>;
