import { z } from "zod";

export const AgentSchema = z.object({
  externalID: z.string(), // TODO: this should be a core model, after kernel is refactored
  provider: z.enum(["openai"]),
  model: z.string(),
  vectorStoreID: z.string(),
  tools: z.array(z.enum(["code_interpreter", "file_search", "function"])),
  resources: z.object({
    vector_stores: z.array(z.string()),
  }),
  instructions: z.string(),
});
