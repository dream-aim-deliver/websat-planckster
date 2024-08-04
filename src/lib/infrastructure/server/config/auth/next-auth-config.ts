/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { NextAuthOptions } from "next-auth";
import NextAuthCredentialsProvider from "./next-auth-credentials-provider";


/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    session: ({ session, token }) => {
      console.log("session", session);
      console.log("token", token);
      return (
        {
          user: {
            ...session.user,
            id: token.sub,
          },
          expires: session.expires,
          role: session.role,
        })
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