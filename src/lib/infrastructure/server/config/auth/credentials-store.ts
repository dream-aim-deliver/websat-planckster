import { env } from "~/env";
import type { TCredentials } from "~/lib/core/entity/auth/userpass-credentials";

export const VALID_CREDENTIALS = [
    { 
        id: env.KP_CLIENT_ID || "1", // TODO: change this to the actual client ID
        username: env.PRIMARY_USER_USERNAME || 'admin',
        password: env.PRIMARY_USER_PASSWORD || '3987anjknk2309^&67'
    },
    {
        id: env.KP_CLIENT_ID || "1", // TODO: change this to the actual client ID
        username: env.SECONDARY_USER_USERNAME || 'user',
        password: env.SECONDARY_USER_PASSWORD || '3987anjknk2309^&67'
    }
  ] as TCredentials[];