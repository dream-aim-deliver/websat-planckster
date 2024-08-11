import { z } from 'zod';

export const LocalFileSchema = z.object({
    type: z.literal('local'),
    relativePath: z.string(),
    name: z.string(),
    raw: z.any().optional(),
});

export type LocalFile = z.infer<typeof LocalFileSchema>;

export const RemoteFileSchema = z.object({
    id: z.string(),
    type: z.literal('remote'),
    provider: z.string(),
    name: z.string(),
    relativePath: z.string(),
    createdAt: z.string(),
});

export type RemoteFile = z.infer<typeof RemoteFileSchema>;

export const FileSchema = z.discriminatedUnion("type", [LocalFileSchema, RemoteFileSchema]);

export type File = z.infer<typeof FileSchema>;
