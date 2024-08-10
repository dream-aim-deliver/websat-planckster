/**
 * This file is included in `/next.config.js` which ensures the app isn't built with invalid env vars.
 * It has to be a `.js`-file to be imported there.
 */

import { z } from "zod";

const serverEnvSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  NEXTAUTH_SECRET:
    process.env.NODE_ENV === "production" ? z.string() : z.string(),
  NEXTAUTH_URL: z.preprocess(
    // This makes Vercel deployments not fail if you don't set NEXTAUTH_URL
    // Since NextAuth.js automatically uses the VERCEL_URL if present.
    (str) => process.env.VERCEL_URL ?? str,
    // VERCEL_URL doesn't include `https` so it cant be validated as a URL
    process.env.VERCEL ? z.string() : z.string().url(),
  ),
  PRIMARY_USER_USERNAME: z.string(),
  PRIMARY_USER_PASSWORD: z.string(),
  KP_HOST: z.string(),
  KP_AUTH_TOKEN: z.string(),
  KP_CLIENT_ID: z.number(),
  OPENAI_API_KEY: z.string(),
  SCRATCH_DIR: z.string().optional().default("/tmp/planckster"),
});

const runtimeEnv = {
  NODE_ENV: process.env.NODE_ENV,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ?? "adfhjsdfg9o21390409sadjn",
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  PRIMARY_USER_USERNAME: process.env.PRIMARY_USER_USERNAME,
  PRIMARY_USER_PASSWORD: process.env.PRIMARY_USER_PASSWORD,
  KP_HOST: process.env.KP_HOST,
  KP_AUTH_TOKEN: process.env.KP_AUTH_TOKEN,
  KP_CLIENT_ID: parseInt(process.env.KP_CLIENT_ID ?? "0"),
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  SCRATCH_DIR: process.env.SCRATCH_DIR ?? "/tmp/planckster",
};

const envValidationResult = serverEnvSchema.safeParse(runtimeEnv);
if (!envValidationResult.success) {
  throw new Error(
    "❌ Invalid environment variables: " +
      JSON.stringify(envValidationResult.error.format(), null, 4),
  );
}

// make sure scratch dir exists
import fs from "fs";
if (!fs.existsSync(envValidationResult.data.SCRATCH_DIR)) {
  fs.mkdirSync(envValidationResult.data.SCRATCH_DIR);
}

export default envValidationResult.data;
