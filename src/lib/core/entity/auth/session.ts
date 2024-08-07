import { z } from 'zod';


/**
 * Represents a session object.
 */
export const SessionSchema = z.object({
    user: z.object({
        id: z.string(),
        name: z.string(),
        email: z.string(),
        image: z.string(),
        kp: z.object({
            client_id: z.number(),
            auth_token: z.string(),
        }),
        role: z.enum(["USER", "ADMIN"]),
    }),
});

export type TSession = z.infer<typeof SessionSchema>;
