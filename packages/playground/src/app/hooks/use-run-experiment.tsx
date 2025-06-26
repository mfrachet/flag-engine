import { useCopilotAction } from "@copilotkit/react-core";
import { useEffect, useMemo, useState } from "react";
import { createFlagEngine } from "@flag-engine/core";
import { stringToColor } from "../utils/stringToColor";

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

  const memoizedResults = useMemo(() => {
    const results: Record<string, number> = {};

    for (const item of sample) {
      const userCtx = engine.createUserContext({ ...userConfig, __id: item });
      const result = String(userCtx.evaluate(config[0].key));

      if (!results[result]) {
        results[result] = 0;
      }

      results[result]++;
    }

    return results;
  }, []);

  const values = Object.values(memoizedResults);
  const keys = Object.keys(memoizedResults);
  const userConfigWithoutId = { ...userConfig };
  delete userConfigWithoutId.__id;

  return (
    <div className="rounded-lg bg-gray-50 p-4">
      <h2 className="text-lg font-bold">Running experiment</h2>
      <p className="pb-2">
        Experiment has been run on {sample.length} fixtures with the following
        user configuration
      </p>
      <pre className="copilotKitCodeBlock p-2 text-white">
        {JSON.stringify(userConfigWithoutId, null, 2)}
      </pre>

      <h3 className="font-bold pt-8 pb-2">Results</h3>

      <div className="flex gap-2">
        {values.map((value, index) => {
          const key = keys[index];
          const percentage = (value / sample.length) * 100;
          return (
            <div key={index} style={{ width: `${100 / values.length}%` }}>
              <div className="relative bg-gray-200 rounded-t-xl overflow-hidden w-full h-32">
                <div
                  className="absolute w-full bottom-0 flex flex-col items-center justify-center"
                  style={{
                    height: `${percentage}%`,
                    backgroundColor: stringToColor(key, 80),
                    color: stringToColor(key, 10),
                  }}
                >
                  {value}
                  <span className="text-xs">({percentage.toFixed(2)}%)</span>
                </div>
              </div>

              <div
                className="text-center text-xs pt-1"
                style={{
                  color: stringToColor(key, 10),
                }}
              >
                {key}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
