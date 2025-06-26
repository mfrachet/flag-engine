import { useCopilotAction } from "@copilotkit/react-core";
import { useEffect, useState } from "react";
import { createFlagEngine } from "@flag-engine/core";

export const useRunExperiment = () => {
  useCopilotAction({
    name: "runExperiment",
    available: "disabled", // Don't allow the agent or UI to call this tool as its only for rendering
    render: ({ status, args }) => {
      return (
        <RunExperiment
          status={status}
          config={args.config}
          userConfig={args.userConfig}
        />
      );
    },
  });
};

const RunExperiment = ({
  status,
  config,
  userConfig = {},
}: {
  status: string;
  config: any;
  userConfig: any;
}) => {
  const [sample, setSample] = useState<string[]>([]);

  useEffect(() => {
    const array = Array.from({ length: 10000 }, (_, i) => i.toString());
    setSample(array);
  }, []);

  if (sample.length === 0) {
    return <div>Sampling data...</div>;
  }

  if (status !== "complete") {
    return <div>Preparing the experiment...</div>;
  }

  return (
    <ExperimentReady sample={sample} config={config} userConfig={userConfig} />
  );
};

const ExperimentReady = ({
  sample,
  config,
  userConfig,
}: {
  sample: string[];
  config: any;
  userConfig: any;
}) => {
  const engine = createFlagEngine(config);
  const results: Record<string, number> = {};

  for (const item of sample) {
    const userCtx = engine.createUserContext({ ...userConfig, __id: item });
    const result = String(userCtx.evaluate(config[0].key));

    if (!results[result]) {
      results[result] = 0;
    }

    results[result]++;
  }

  return <div>Result is here: {JSON.stringify(results, null, 2)}</div>;
};
