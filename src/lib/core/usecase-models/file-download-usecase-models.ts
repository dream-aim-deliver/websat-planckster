import { z } from "zod";

export const FileDownloadRequestSchema = z.object({
  status: z.literal("request"),
  relativePath: z.string(),
  localPath: z.string().optional(),
});

export type TFileDownloadRequest = z.infer<typeof FileDownloadRequestSchema>;

export const FileDownloadSuccessResponseSchema = z.object({
  status: z.literal("success"),
  message: z.string(),
});

export type TFileDownloadSuccessResponse = z.infer<typeof FileDownloadSuccessResponseSchema>;

export const FileDownloadPartialResponseSchema = z.object({
  status: z.literal("partial"),
  message: z.string(),
  unsuccessfullFileNames: z.array(z.string()),
});

export type TFileDownloadPartialResponse = z.infer<typeof FileDownloadPartialResponseSchema>;

export const FileDownloadErrorResponseSchema = z.object({
  status: z.literal("error"),
  operation: z.string(),
  message: z.string(),
  context: z.any().optional(),
});

export type TFileDownloadErrorResponse = z.infer<typeof FileDownloadErrorResponseSchema>;

export const FileDownloadProgressResponseSchema = z.object({
  status: z.literal("progress"),
  message: z.string(),
  progress: z.number(),
});

export type TFileDownloadProgressResponse = z.infer<typeof FileDownloadProgressResponseSchema>;

export const FileDownloadResponseSchema = z.discriminatedUnion("status", [FileDownloadSuccessResponseSchema, FileDownloadErrorResponseSchema, FileDownloadPartialResponseSchema, FileDownloadProgressResponseSchema]);
export type TFileDownloadResponse = z.infer<typeof FileDownloadResponseSchema>;
