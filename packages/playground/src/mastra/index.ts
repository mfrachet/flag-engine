import { Mastra } from "@mastra/core/mastra";
import { PinoLogger } from "@mastra/loggers";
import { LibSQLStore } from "@mastra/libsql";
import { weatherWorkflow } from "./workflows/weather-workflow";
import { flagEngineAgent } from "./agents/flag-engine-agent";

const ENV = process.env.NODE_ENV || "development";

export const mastra = new Mastra({
  workflows: { weatherWorkflow },
  agents: { flagEngineAgent },
  storage: new LibSQLStore({
    // stores telemetry, evals, ... into memory storage, if it needs to persist, change to file:../mastra.db
    url: ":memory:",
  }),
  logger: new PinoLogger({
    name: "Mastra",
    level: "info",
  }),
  server: {
    // Disable CORS for development
    cors:
      ENV === "development"
        ? {
            origin: "*",
            allowMethods: ["*"],
            allowHeaders: ["*"],
          }
        : undefined,
  },
});
