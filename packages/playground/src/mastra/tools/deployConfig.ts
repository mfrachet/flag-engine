import { createTool } from "@mastra/core";
import z from "zod";

export const deployConfig = createTool({
  id: "deployConfig",
  description: "Deploy a configuration to the flag engine",
  inputSchema: z.object({
    config: z.any(),
  }),
  execute: async ({ context: { config } }) => {
    return {
      success: true,
      message: "Config deployed successfully",
    };
  },
});
