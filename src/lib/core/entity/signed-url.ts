import { z } from 'zod';

export const UploadSignedUrlSchema = z.object({
    type: z.literal('upload-signed-url'),
    url: z.string(),
})

export type UploadSignedUrl = z.infer<typeof UploadSignedUrlSchema>;

export const DownloadSignedUrlSchema = z.object({
    type: z.literal('download-signed-url'),
    url: z.string(),
})

export type DownloadSignedUrl = z.infer<typeof DownloadSignedUrlSchema>;

export const SignedUrlSchema = z.discriminatedUnion("type", [UploadSignedUrlSchema, DownloadSignedUrlSchema]);

export type SignedUrl = z.infer<typeof SignedUrlSchema>;
