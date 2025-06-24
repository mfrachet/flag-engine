import {
  CopilotRuntime,
  ExperimentalEmptyAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from "@copilotkit/runtime";

import { MastraAgent } from "@ag-ui/mastra";
import { MastraClient } from "@mastra/client-js";
import { NextRequest } from "next/server";

// 1. Base address for the Mastra server
const MASTRA_URL = process.env.MASTRA_URL || "http://localhost:4111";

// 2. You can use any service adapter here for multi-agent support. We use
//    the empty adapter since we're only using one agent.
const serviceAdapter = new ExperimentalEmptyAdapter();

// 3. Create the CopilotRuntime instance and utilize the Mastra AG-UI
//    integration to get the remote agents.
const runtime = new CopilotRuntime({
  agents: await MastraAgent.getRemoteAgents({
    mastraClient: new MastraClient({ baseUrl: MASTRA_URL }),
  }),
});

// 4. Build a Next.js API route that handles the CopilotKit runtime requests.
export const POST = async (req: NextRequest) => {
  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    serviceAdapter,
    endpoint: "/api/copilotkit",
  });

  return handleRequest(req);
};
