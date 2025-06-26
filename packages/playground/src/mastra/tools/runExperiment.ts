import { createTool } from "@mastra/core";
import z from "zod";

export const runExperiment = createTool({
  id: "runExperiment",
  description: "Run a feature flag experiment",
  inputSchema: z.object({
    config: z.any().describe("The FlagsConfiguration object"),
    userConfig: z
      .any()
      .describe(
        "The 'UserConfiguration' object where attributes should match the strategy field names"
      )
      .optional(),
  }),
  execute: async ({ context: { config } }) => {
    return {
      success: true,
      message: "Experiment run successfully",
    };
  },
});
