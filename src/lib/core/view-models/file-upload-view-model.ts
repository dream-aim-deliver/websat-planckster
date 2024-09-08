import { z } from "zod";
import { BaseViewModelRequestSchema } from "../../../sdk/core/view-models";

export const FileUploadRequestViewModelSchema = BaseViewModelRequestSchema.extend({
});

export const FileUploadSuccessViewModelSchema = z.object({
    status: z.enum(["success"]),
    message: z.string(),
    fileName: z.string(),
});

export const FileUploadProgressViewModelSchema = z.object({
    status: z.enum(["progress"]),
    message: z.string(),
    progress: z.number(),
});

export const FileUploadErrorResponseViewModelSchema = z.object({
    status: z.enum(["error"]),
    message: z.string(),
    context: z.any().optional(),
});

export const FileUploadViewModelSchema = z.discriminatedUnion("status", [
    FileUploadRequestViewModelSchema,
    FileUploadSuccessViewModelSchema,
    FileUploadProgressViewModelSchema,
    FileUploadErrorResponseViewModelSchema,
]);

export type TFileUploadViewModel = z.infer<typeof FileUploadViewModelSchema>;