import { z } from "zod";

const GetSignedURLSuccessViewModelSchema = z.object({
    success: z.literal(true),
    data: z.object({
        signedUrl: z.string(),
    }),
});

const GetSignedURLErrorViewModelSchema = z.object({
    success: z.literal(false),
    data: z.object({
        operation: z.string(),
        message: z.string(),
    }),
});

export const GetSignedURLViewModelSchema = z.discriminatedUnion("success", [
    GetSignedURLSuccessViewModelSchema,
    GetSignedURLErrorViewModelSchema,
]);
export type TGetSignedURLViewModel = z.infer<typeof GetSignedURLViewModelSchema>;