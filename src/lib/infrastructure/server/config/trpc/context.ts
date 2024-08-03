import { headers } from "next/headers";
import { cache } from "react";
import { createTRPCContext } from "~/lib/infrastructure/trpc/trpc";
import { OpenAPI as KERNEL_PLANCKSTER_CONFIG } from "@maany_shr/kernel-planckster-sdk-ts";
import { env } from "~/env";

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a tRPC call from a React Server Component.
 */
const createContext = cache(() => {
    const heads = new Headers(headers());
    heads.set("x-trpc-source", "rsc");
  
    // Configure OpenAPI SDK to point to the correct kernel planckster host
    KERNEL_PLANCKSTER_CONFIG.BASE = env.KP_HOST;
    
    return createTRPCContext({
      headers: heads,
    });
  });

export default createContext;