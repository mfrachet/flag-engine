import { useCopilotAction } from "@copilotkit/react-core";

export const useDeployConfigTool = () => {
  useCopilotAction({
    name: "deployConfig",
    available: "disabled", // Don't allow the agent or UI to call this tool as its only for rendering
    render: ({ status, args }) => {
      return (
        <p className="text-gray-500 mt-2">
          {status !== "complete" &&
            "Deploying the feature flags configuration..."}
          {status === "complete" &&
            `Feature flags configuration deployed successfully!`}
        </p>
      );
    },
  });
};
