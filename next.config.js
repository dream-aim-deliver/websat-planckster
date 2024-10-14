/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
if (process.env.SKIP_ENV_VALIDATION) {
  console.warn(
    "⚠️ Skipping environment variables validation. This is dangerous in production.",
  );
} else {
  await import("./src/lib/infrastructure/server/config/env.js");
  await import("./src/lib/infrastructure/client/config/env.js");
}
/** @type {import("next").NextConfig} */
const config = {
  transpilePackages: ["superjson", "@maany_shr/planckster-ui-kit", "@maany_shr/rage-ui-kit", "@preact/signals-react", "@preact/signals-core"],
  experimental: {
    serverComponentsExternalPackages: ["pino", "pino-pretty"],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization.innerGraph = false;
    }
    return config;
  },
};

export default config;
