import { useCopilotAction } from "@copilotkit/react-core";
import { Spinner } from "../components/Spinner";

export const useDeployConfigTool = () => {
  useCopilotAction({
    name: "deployConfig",
    available: "disabled", // Don't allow the agent or UI to call this tool as its only for rendering
    render: ({ status, args }) => {
      if (status !== "complete") {
        return (
          <div className="flex items-center gap-2">
            <Spinner /> Deploying the feature flags configuration...
          </div>
        );
      }

      return <></>;
    },
  });
};
