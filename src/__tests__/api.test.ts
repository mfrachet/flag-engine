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

    it("returns true when the flag is enabled with no strategies", () => {
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

    it("returns true when the flag is enabled when at least one strategy is fulfilled", () => {
      const flagsConfig: FlagsConfiguration = [
        {
          key: "new-homepage",
          status: "enabled",
          strategies: [
            {
              name: "default",
              rules: [
                {
                  field: "firstName",
                  operator: "contains",
                  value: "marvin",
                },
                {
                  field: "lastName",
                  operator: "contains",
                  value: "frachet",
                },
              ],
              variants: [],
            },
            {
              name: "other",
              rules: [
                {
                  field: "country",
                  operator: "equals",
                  value: "US",
                },
              ],
              variants: [],
            },
          ],
        },
      ];

      const machine = buildEvaluationMachine(flagsConfig, {
        __id: "yo",
        firstName: "marvin",
        lastName: "frachet",
        country: "FR",
      });

      expect(machine.evaluateAll()).toEqual({ "new-homepage": true });
    });

    it("returns false when the flag is enabled and match no strategy", () => {
      const flagsConfig: FlagsConfiguration = [
        {
          key: "new-homepage",
          status: "enabled",
          strategies: [
            {
              name: "default",
              rules: [
                {
                  field: "firstName",
                  operator: "contains",
                  value: "marvin",
                },
                {
                  field: "lastName",
                  operator: "contains",
                  value: "frachet",
                },
              ],
              variants: [],
            },
            {
              name: "other",
              rules: [
                {
                  field: "country",
                  operator: "equals",
                  value: "US",
                },
              ],
              variants: [],
            },
          ],
        },
      ];

      const machine = buildEvaluationMachine(flagsConfig, {
        __id: "yo",
        notMatching: "hello",
      });

      expect(machine.evaluateAll()).toEqual({ "new-homepage": false });
    });
  });
});
