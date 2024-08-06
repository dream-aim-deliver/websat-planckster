import { z } from "zod";

export const FileUploadRequestSchema = z.object({
    file: z.instanceof(File),
});

export type TFileUploadRequest = z.infer<typeof FileUploadRequestSchema>;


export const FileUploadSuccessResponseSchema = z.object({
    message: z.string(),
    fileName: z.string(),
});

export type TFileUploadSuccessResponse = z.infer<typeof FileUploadSuccessResponseSchema>;

export const FileUploadErrorResponseSchema = z.object({
    message: z.string(),
});

export type TFileUploadErrorResponse = z.infer<typeof FileUploadErrorResponseSchema>;

export const FileUploadProgressResponseSchema = z.object({
    message: z.string(),
    progress: z.number(),
});

export type TFileUploadProgressResponse = z.infer<typeof FileUploadProgressResponseSchema>;

