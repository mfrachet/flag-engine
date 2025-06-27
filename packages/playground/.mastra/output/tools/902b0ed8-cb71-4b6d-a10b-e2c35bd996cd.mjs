import { createTool } from '@mastra/core';
import z from 'zod';

const deployConfig = createTool({
  id: "deployConfig",
  description: "Deploy a configuration to the flag engine",
  inputSchema: z.object({
    config: z.any()
  }),
  execute: async ({ context: { config } }) => {
    return {
      success: true,
      message: "Config deployed successfully"
    };
  }
});

export { deployConfig };
//# sourceMappingURL=902b0ed8-cb71-4b6d-a10b-e2c35bd996cd.mjs.map
