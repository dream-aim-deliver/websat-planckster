import { z } from "zod";
import { BaseViewModelRequestSchema } from "../../../sdk/core/view-models";

export const FileDownloadRequestViewModelSchema = BaseViewModelRequestSchema.extend({});

export const FileDownloadSuccessViewModelSchema = z.object({
    status: z.enum(["success"]),
    message: z.string(),
});

export const FileDownloadPartialViewModelSchema = z.object({
    status: z.enum(["partial"]),
    message: z.string(),
    unsuccessfullFileNames: z.array(z.string()),
});

export const FileDownloadProgressViewModelSchema = z.object({
    status: z.enum(["progress"]),
    message: z.string(),
    progress: z.number(),
});

export const FileDownloadErrorResponseViewModelSchema = z.object({
    status: z.enum(["error"]),
    message: z.string(),
});

export const FileDownloadViewModelSchema = z.discriminatedUnion("status", [
    FileDownloadRequestViewModelSchema,
    FileDownloadSuccessViewModelSchema,
    FileDownloadPartialViewModelSchema, 
    FileDownloadProgressViewModelSchema,
    FileDownloadErrorResponseViewModelSchema,
]);

export type TFileDownloadViewModel = z.infer<typeof FileDownloadViewModelSchema>;
