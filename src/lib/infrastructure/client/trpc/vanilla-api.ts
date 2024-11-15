import { createTRPCClient, httpBatchLink } from '@trpc/client';
import superjson from 'superjson';
import type { AppRouter } from '~/lib/infrastructure/server/trpc/app-router';
import env from '../config/env';
// TODO: add client side env variable to configure the url of the trpc server
const client = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
        url: `${env.NEXT_PUBLIC_APP_URL}/api/trpc`,

        // You can pass any HTTP headers you wish here
        // async headers() {
        //     return {
                
        //     };
        // },
        transformer: superjson
    }),
  ],
});

export type TVanillaAPI = typeof client;

export const api = client;