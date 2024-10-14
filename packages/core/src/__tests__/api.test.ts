import { expect, describe, it } from "vitest";
import { FlagsConfiguration } from "../types";
import { buildEvaluationMachine } from "../";

describe("api", () => {
  describe("setUserConfiguration", () => {
    it("sets the user configuration", () => {
      const initialFlagsConfig: FlagsConfiguration = [
        {
          key: "new-homepage",
          status: "enabled",
          strategies: [
            {
              name: "default",
              rules: [
                {
                  field: "__id",
                  operator: "equals",
                  value: "marvin",
                },
              ],
              variants: [],
            },
          ],
        },
      ];

      const machine = buildEvaluationMachine(initialFlagsConfig, {
        __id: "marvin",
      });

      expect(machine.evaluate("new-homepage")).toEqual(true);
      machine.setUserConfiguration({ __id: "yo" });
      expect(machine.evaluate("new-homepage")).toEqual(false);
    });
  });

  describe("evaluate", () => {
    it("returns false when the flag does not exist", () => {
      const flagsConfig: FlagsConfiguration = [
        {
          key: "new-homepage",
          status: "enabled",
          strategies: [],
        },
      ];

      const machine = buildEvaluationMachine(flagsConfig, { __id: "yo" });
      expect(machine.evaluate("does-not-exist")).toEqual(false);
    });

    it("returns false when the flag is disabled", () => {
      const flagsConfig: FlagsConfiguration = [
        {
          key: "new-homepage",
          status: "disabled",
          strategies: [],
        },
      ];

      const machine = buildEvaluationMachine(flagsConfig, { __id: "yo" });
      expect(machine.evaluate("new-homepage")).toEqual(false);
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
      expect(machine.evaluate("new-homepage")).toEqual(true);
    });
  });

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

    it("returns 'Control' variant when the flag is enabled and with __id being 'A'", () => {
      const flagsConfig: FlagsConfiguration = [
        {
          key: "new-homepage",
          status: "enabled",
          strategies: [
            {
              name: "default",
              rules: [],
              variants: [
                {
                  name: "Control",
                  percent: 90,
                },
                {
                  name: "B",
                  percent: 10,
                },
              ],
            },
          ],
        },
      ];

      const machine = buildEvaluationMachine(flagsConfig, {
        __id: "A",
        notMatching: "hello",
      });

      expect(machine.evaluateAll()).toEqual({ "new-homepage": "Control" });
    });

    it("returns 'B' variant when the flag is enabled and with __id being 'yo'", () => {
      const flagsConfig: FlagsConfiguration = [
        {
          key: "new-homepage",
          status: "enabled",
          strategies: [
            {
              name: "default",
              rules: [],
              variants: [
                {
                  name: "Control",
                  percent: 90,
                },
                {
                  name: "B",
                  percent: 10,
                },
              ],
            },
          ],
        },
      ];

      const machine = buildEvaluationMachine(flagsConfig, {
        __id: "yo",
        notMatching: "hello",
      });

      expect(machine.evaluateAll()).toEqual({ "new-homepage": "B" });
    });

    it("resolves the variants 'Control' of the matching strategy for the __id 'A'", () => {
      const flagsConfig: FlagsConfiguration = [
        {
          key: "new-homepage",
          status: "enabled",
          strategies: [
            {
              name: "other",
              rules: [
                {
                  field: "country",
                  operator: "equals",
                  value: "US",
                },
              ],
              variants: [
                {
                  name: "OtherControl",
                  percent: 90,
                },
                {
                  name: "OtherB",
                  percent: 10,
                },
              ],
            },
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
              variants: [
                {
                  name: "Control",
                  percent: 90,
                },
                {
                  name: "B",
                  percent: 10,
                },
              ],
            },
          ],
        },
      ];

      const machine = buildEvaluationMachine(flagsConfig, {
        __id: "A",
        firstName: "marvin",
        lastName: "frachet",
        country: "FR",
      });

      expect(machine.evaluateAll()).toEqual({ "new-homepage": "Control" });
    });

    it("resolves the variants 'B' of the matching strategy for the __id 'yo'", () => {
      const flagsConfig: FlagsConfiguration = [
        {
          key: "new-homepage",
          status: "enabled",
          strategies: [
            {
              name: "other",
              rules: [
                {
                  field: "country",
                  operator: "equals",
                  value: "US",
                },
              ],
              variants: [
                {
                  name: "OtherControl",
                  percent: 90,
                },
                {
                  name: "OtherB",
                  percent: 10,
                },
              ],
            },
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
              variants: [
                {
                  name: "Control",
                  percent: 90,
                },
                {
                  name: "B",
                  percent: 10,
                },
              ],
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

      expect(machine.evaluateAll()).toEqual({ "new-homepage": "B" });
    });

    it("returns false when the variant are not configured correctly", () => {
      const flagsConfig: FlagsConfiguration = [
        {
          key: "new-homepage",
          status: "enabled",
          strategies: [
            {
              name: "other",
              rules: [],
              variants: [
                {
                  name: "OtherControl",
                  percent: 0,
                },
                {
                  name: "OtherB",
                  percent: 0,
                },
              ],
            },
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
              variants: [
                {
                  name: "Control",
                  percent: 90,
                },
                {
                  name: "B",
                  percent: 10,
                },
              ],
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

      expect(machine.evaluateAll()).toEqual({ "new-homepage": false });
    });

    it("returns true when the user is in the segment", () => {
      const flagsConfig: FlagsConfiguration = [
        {
          key: "new-homepage",
          status: "enabled",
          strategies: [
            {
              name: "other",
              rules: [
                {
                  inSegment: {
                    name: "segment-1",
                    rules: [
                      {
                        field: "country",
                        operator: "contains",
                        value: "F",
                      },
                    ],
                  },
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
  });
});
