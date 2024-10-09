import { expect, describe, it, beforeEach } from "vitest";
import { EvaluationMachine, FlagsConfiguration } from "../types";
import { buildEvaluationMachine } from "../buildEvaluationMachine";

describe("api", () => {
  describe("evaluateAll", () => {
    it("returns false when the flag is disabled", () => {
      const flagsConfig: FlagsConfiguration = [
        {
          key: "new-homepage",
          status: "disabled",
          strategies: [],
        },
      ];

      const machine = buildEvaluationMachine(flagsConfig, { __id: "yo" });
      expect(machine.evaluateAll()).toEqual({ "new-homepage": false });
    });

    it("returns true when the flag is enabledwith no strategies", () => {
      const flagsConfig: FlagsConfiguration = [
        {
          key: "new-homepage",
          status: "enabled",
          strategies: [],
        },
      ];

      const machine = buildEvaluationMachine(flagsConfig, { __id: "yo" });
      expect(machine.evaluateAll()).toEqual({ "new-homepage": true });
    });
  });
});
