"use client";

import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "~/lib/infrastructure/server/trpc/app-router";

export const api = createTRPCReact<AppRouter>();

export type TClientComponentAPI = typeof api;