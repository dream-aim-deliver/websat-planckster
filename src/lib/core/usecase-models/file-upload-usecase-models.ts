import { z } from "zod";
import { LocalFileSchema } from "../entity/file";

export const FileUploadRequestSchema = z.object({
    status: z.literal("request"),
    file: LocalFileSchema,
});

export type TFileUploadRequest = z.infer<typeof FileUploadRequestSchema>;


export const FileUploadSuccessResponseSchema = z.object({
    status: z.literal("success"),
    message: z.string(),
    fileName: z.string(),
});

export type TFileUploadSuccessResponse = z.infer<typeof FileUploadSuccessResponseSchema>;

export const FileUploadErrorResponseSchema = z.object({
    status: z.literal("error"),
    operation: z.string(),
    message: z.string(),
    context: z.any().optional(),
});

export type TFileUploadErrorResponse = z.infer<typeof FileUploadErrorResponseSchema>;

export const FileUploadProgressResponseSchema = z.object({
    status: z.literal("progress"),
    message: z.string(),
    progress: z.number(),
});

export type TFileUploadProgressResponse = z.infer<typeof FileUploadProgressResponseSchema>;

export const FileUploadResponseSchema = z.discriminatedUnion("status", [
    FileUploadSuccessResponseSchema,
    FileUploadErrorResponseSchema,
    FileUploadProgressResponseSchema,
]);
export type TFileUploadResponse = z.infer<typeof FileUploadResponseSchema>;

