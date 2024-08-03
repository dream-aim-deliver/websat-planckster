import NextAuth, { type AuthOptions } from "next-auth";
import serverContainer from "~/lib/infrastructure/server/config/ioc/server-container";
import { CONSTANTS } from "~/lib/infrastructure/server/config/ioc/server-ioc-symbols";

const authOptions = serverContainer.get<AuthOptions>(CONSTANTS.NEXT_AUTH_OPTIONS);
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
