import { z } from 'zod';

import { HealthCheckService as sdk } from '@maany_shr/kernel-planckster-sdk-ts';
import { createTRPCRouter, publicProcedure } from '../../server';

export const kernelPlancksterHealthCheckRouter = createTRPCRouter({
    ping: publicProcedure
        .input(
            z.object({
            }),
        )
        .query(async ({ input }) => {
            try {
                await sdk.healthCheck();
                return true;
            } catch (error) {
                return false;
            }
        }),
});