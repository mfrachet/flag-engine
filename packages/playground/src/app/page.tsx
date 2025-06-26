"use client";
import { CopilotChat } from "@copilotkit/react-ui";
import { useDeployConfigTool } from "./hooks/use-deploy-config-tool";
import { useRunExperiment } from "./hooks/use-run-experiment";

export default function Home() {
  useDeployConfigTool();
  useRunExperiment();

  return (
    <main className="flex items-center justify-center bg-gradient-to-r from-violet-200 to-pink-200 h-full">
      <h1 className="sr-only">Flag engine playground</h1>

      <div className="max-w-xl w-full mx-auto overflow-scroll rounded-3xl border border-gray-200 shadow-lg bg-white">
        <CopilotChat
          labels={{
            title: "Your Assistant",
            initial: "Hi! 👋 How can I assist you today?",
          }}
        />
      </div>
    </main>
  );
}
