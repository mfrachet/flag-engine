import { buildEvaluationMachine } from "./buildEvaluationMachine";
import { FlagsConfiguration } from "./types";

const flagsConfig: FlagsConfiguration = [
  {
    key: "new-homepage",
    status: "enabled",
    strategies: [
      {
        name: "default",
        rules: [],
        variants: [
          { name: "Control", percent: 90 },
          { name: "B", percent: 10 },
        ],
      },
    ],
  },
];

const machine = buildEvaluationMachine(flagsConfig, { __id: "yo" });

const flags = machine.evaluateAll();
