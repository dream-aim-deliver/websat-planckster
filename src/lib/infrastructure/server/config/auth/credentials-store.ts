import { env } from "~/env";
import type { TCredentials } from "~/lib/core/entity/auth/userpass-credentials";

export const VALID_CREDENTIALS =
    {
        username: env.PRIMARY_USER_USERNAME || 'admin',
        password: env.PRIMARY_USER_PASSWORD || '3987anjknk2309^&67'
    } as TCredentials;