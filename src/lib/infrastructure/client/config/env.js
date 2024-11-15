/**
 * This file is included in `/next.config.js` which ensures the app isn't built with invalid env vars.
 * It has to be a `.js`-file to be imported there.
 */

import { z } from "zod";

const clientEnvSchema = z.object({
  //   NEXT_PUBLIC_CLIENTVAR: z.string(),
  NEXT_PUBLIC_APP_URL: z.string().url(),
});

const runtimeEnv = {
  //   NEXT_PUBLIC_CLIENTVAR: process.env.NEXT_PUBLIC_CLIENTVAR,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
};

let env = runtimeEnv;

const envValidationResult = clientEnvSchema.safeParse(runtimeEnv);
if (!envValidationResult.success) {
  throw new Error(
    "❌ Invalid client environment variables: " +
      JSON.stringify(envValidationResult.error.format(), null, 4),
  );
}

export default env;
