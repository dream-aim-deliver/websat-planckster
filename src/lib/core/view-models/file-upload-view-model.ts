import { z } from "zod";
import { BaseViewModelRequestSchema } from "../../../sdk/core/view-models";

export const FileUploadingRequestViewModelSchema = BaseViewModelRequestSchema.extend({
});

export const FileUploadingSuccessViewModelSchema = z.object({
    status: z.enum(["success"]),
    message: z.string(),
    fileName: z.string(),
});

export const FileUploadingProgressViewModelSchema = z.object({
    status: z.enum(["progress"]),
    message: z.string(),
    progress: z.number(),
});

export const FileUploadingErrorResponseViewModelSchema = z.object({
    status: z.enum(["error"]),
    message: z.string(),
    context: z.any().optional(),
});

export const FileUploadingViewModelSchema = z.discriminatedUnion("status", [
    FileUploadingRequestViewModelSchema,
    FileUploadingSuccessViewModelSchema,
    FileUploadingProgressViewModelSchema,
    FileUploadingErrorResponseViewModelSchema,
]);

export type TFileUploadingViewModel = z.infer<typeof FileUploadingViewModelSchema>;