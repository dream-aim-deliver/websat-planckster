import { z } from 'zod';

/**
 * Represents the credentials of a user for logging into the platform.
 */

export const CredentialsSchema = z.object({
    id: z.string(),
    username: z.string(),
    password: z.string(),
});

export type TCredentials = z.infer<typeof CredentialsSchema>;

