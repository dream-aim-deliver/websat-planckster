import { z } from "zod";
import { RemoteFileSchema } from "../file";

export const VectorStoreSchema = z.object({
    status: z.enum(["created", "processing", "available", "error"]),
    id: z.string(),
    provider: z.string(),
});

export const EmbeddingsSchema = z.object({
    id: z.string(),
    provider: z.string(),
    model: z.string(),
    files: z.array(RemoteFileSchema),
});

export type TEmbeddings = z.infer<typeof EmbeddingsSchema>;