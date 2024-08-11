import { z } from "zod";

export const FileDownloadRequestSchema = z.object({
    relativePath: z.string(), 
});

export type TFileDownloadRequest = z.infer<typeof FileDownloadRequestSchema>;


export const FileDownloadSuccessResponseSchema = z.object({
    message: z.string(),
});

export type TFileDownloadSuccessResponse = z.infer<typeof FileDownloadSuccessResponseSchema>;

export const FileDownloadPartialResponseSchema = z.object({
    message: z.string(),
    unsuccessfullFileNames: z.array(z.string()),
});

export type TFileDownloadPartialResponse = z.infer<typeof FileDownloadPartialResponseSchema>;

export const FileDownloadErrorResponseSchema = z.object({
    message: z.string(),
    context: z.any().optional(),
});

export type TFileDownloadErrorResponse = z.infer<typeof FileDownloadErrorResponseSchema>;

export const FileDownloadProgressResponseSchema = z.object({
    message: z.string(),
    progress: z.number(),
});

export type TFileDownloadProgressResponse = z.infer<typeof FileDownloadProgressResponseSchema>;

