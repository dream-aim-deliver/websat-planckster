/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { NextAuthOptions } from "next-auth";
import NextAuthCredentialsProvider from "./next-auth-credentials-provider";
import { SessionSchema } from "~/lib/core/entity/auth/session";


/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    jwt: async ({token, user}) => {
      user && (token.user = user)
      return token;
    },
    session: ({ session, token }) => {
      // console.log("initial session", session);
      token.user &&  (session.user = token.user);
      const validationResponse = SessionSchema.safeParse(session);
      if (!validationResponse.success) {
        throw new Error("Session schema validation failed");
      }
      // console.log("final session", session);

      return session;
    },
  },

  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },

  providers: [
    new NextAuthCredentialsProvider().getProvider(),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
};