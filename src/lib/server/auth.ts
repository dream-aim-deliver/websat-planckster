import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { env } from "~/env";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   id: string;
  //   // ...other properties
  //   // role: UserRole;
  // }
}

export type TCredentials = {
  id: string;
  username: string;
  password: string;
};

const VALID_CREDENTIALS = [
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

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    session: ({ session, token }) => ({
      ...session,
      user: {
        ...session.user,
        id: token.sub,
      },
    }),
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  providers: [
    CredentialsProvider({
      type: "credentials",
      credentials: {
        id: { label: "ID", type: "text" },
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials, req) => {
        const { username, password } = credentials as { username: string, password: string };
        for (const validCredential of VALID_CREDENTIALS) {
          if (validCredential.username === username && validCredential.password === password) {
            return Promise.resolve({
              id: validCredential.id,
              name: username,
            });
          }
        }
        throw new Error('Invalid credentials');
      },
    }),
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

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions);
