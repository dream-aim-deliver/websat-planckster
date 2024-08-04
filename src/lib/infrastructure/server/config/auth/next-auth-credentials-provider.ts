import CredentialsProvider, { type CredentialsConfig } from "next-auth/providers/credentials";
import { VALID_CREDENTIALS } from "./credentials-store";
import type { TSession } from "~/lib/core/entity/auth/session";
import { env } from "~/env";


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
                if (VALID_CREDENTIALS.username === username && VALID_CREDENTIALS.password === password) {
                    const user: TSession["user"] = {
                        id: env.KP_CLIENT_ID.toString() || "1",
                        name: username,
                        email: "planckster-example@mpi-sws.org",
                        image: "https://cdn-icons-png.freepik.com/512/3177/3177440.png", // TODO: change this to the actual image
                        kp: {
                            client_id: env.KP_CLIENT_ID || 1,
                            auth_token: env.KP_AUTH_TOKEN
                        }
                    };

                    return Promise.resolve(user);
                }
                throw new Error('Invalid credentials');
            },
        });
    }

    getProvider(): CredentialsConfig {
        return this.credentialsConfig;
    }
}