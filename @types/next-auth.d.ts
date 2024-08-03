// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth from "next-auth"
import type { TSession } from "~/lib/core/entity/auth/session"
/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface Session extends TSession { }

    // Optionally, override the User type
    // interface User {
    //   // ...other properties
    //   role: "user" | "admin";
    // }
}
