import { z } from "zod";

export const VectorStoreSchema = z.object({
    id: z.string(),
    provider: z.string(),
    status: z.enum(["created", "processing", "available", "error"]),
});
