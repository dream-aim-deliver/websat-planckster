import CredentialsProvider, { type CredentialsConfig } from "next-auth/providers/credentials";
import { VALID_CREDENTIALS } from "./credentials-store";
import type { TSession } from "~/lib/core/entity/auth/session";


export default class NextAuthCredentialsProvider {
    private credentialsConfig: CredentialsConfig;

    constructor() {
        this.credentialsConfig = CredentialsProvider({
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
                        const user: TSession["user"] = {
                            id: validCredential.id,
                            name: username,
                            email: "planckster-example@mpi-sws.org",
                            image: "https://www.gravatar.com/avatar/",
                        };

                        return Promise.resolve(user);
                    }
                }
                throw new Error('Invalid credentials');
            },
        });
    }

    getProvider(): CredentialsConfig {
        return this.credentialsConfig;
    }
}