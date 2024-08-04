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
    jwt: async ({token, user}) => {
      console.log("jwt", token);
      console.log("user", user);
      user && (token.user = user)
      return token;
    },
    session: ({ session, token }) => {
      console.log("session", session);
      console.log("token", token);
      token.user &&  (session.user = token.user);
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