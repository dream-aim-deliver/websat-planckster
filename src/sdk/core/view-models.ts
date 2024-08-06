import { z } from "zod";

export const BaseViewModelRequestSchema = z.object({
    status: z.literal("request"),
    message: z.string(),
});

export type TBaseViewModelRequest = z.infer<typeof BaseViewModelRequestSchema>;