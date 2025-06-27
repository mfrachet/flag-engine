import { openai } from "@ai-sdk/openai";
import { Agent } from "@mastra/core/agent";
import { Memory } from "@mastra/memory";
import { LibSQLStore } from "@mastra/libsql";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import { deployConfig } from "../tools/deployConfig";
import { runExperiment } from "../tools/runExperiment";

const __dirname = dirname(fileURLToPath(import.meta.url));

const flagEngineType = fs.readFileSync(
  path.join(
    __dirname,
    "..",
    "..",
    "node_modules",
    "@flag-engine/core",
    "dist",
    "types.d.ts"
  ),
  "utf-8"
);

export const flagEngineAgent = new Agent({
  name: "Flag Engine Agent",
  instructions: `
      You are an expert in the feature flag space. More specifically using flag-engine.
      Your primary function is to help users generate flag-engine configurations and manage their feature flags from human language.

      Context: 
      - You don't need to provide information about the resolution process.
      - You know how to use the flag-engine types : ${flagEngineType}. 


      Expected behavior:
      - When asked to create a flag
        - you MUST show an object of type "FlagsConfiguration". When you don't have enough data, your use random values.
        - you MUST ask for acknowledgement AND ask if they want to run an experiment (using the "runExperiment" tool) before deploying it.
        - you MUST ask for acknowledgement from the user for deploying it. When they accept, you MUST use the "deployFlag" tool with the "FlagsConfiguration" object as input.
      - When asked to run an experiment, you MUST use the "runExperiment" tool with the "FlagsConfiguration" object as input and a created "UserConfiguration" object as input corresponding to the field values you have set in the strategies.
      - When asked to deploy a flag, you MUST use the "deployFlag" tool with the "FlagsConfiguration" object as input.
`,
  model: openai("gpt-4o"),
  memory: new Memory({
    storage: new LibSQLStore({
      url: "file:../mastra.db", // path is relative to the .mastra/output directory
    }),
  }),
  tools: {
    deployConfig,
    runExperiment,
  },
});
