import { expect, describe, it } from "vitest";
import { FlagsConfiguration } from "../types";
import { createFlagEngine } from "../";

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
                  value: ["marvin"],
                },
              ],
              variants: [],
            },
          ],
        },
      ];

      const engine = createFlagEngine(initialFlagsConfig);
      const userCtx = engine.createUserContext({ __id: "marvin" });

      expect(userCtx.evaluate("new-homepage")).toEqual(true);
      userCtx.setUserConfiguration({ __id: "yo" });
      expect(userCtx.evaluate("new-homepage")).toEqual(false);
    });
  });

  describe("evaluate and evaluateAll consistency", () => {
    it("both return false for an invalid status value", () => {
      const flagsConfig = [
        {
          key: "new-homepage",
          status: "enbaled" as FlagsConfiguration[number]["status"],
          strategies: [],
        },
      ];

      const engine = createFlagEngine(flagsConfig);
      const userCtx = engine.createUserContext({ __id: "yo" });
      expect(userCtx.evaluate("new-homepage")).toEqual(false);
      expect(userCtx.evaluateAll()).toEqual({ "new-homepage": false });
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

      const engine = createFlagEngine(flagsConfig);
      const userCtx = engine.createUserContext({ __id: "yo" });
      expect(userCtx.evaluate("does-not-exist")).toEqual(false);
    });

    it("returns false when the flag is disabled", () => {
      const flagsConfig: FlagsConfiguration = [
        {
          key: "new-homepage",
          status: "disabled",
          strategies: [],
        },
      ];

      const engine = createFlagEngine(flagsConfig);
      const userCtx = engine.createUserContext({ __id: "yo" });
      expect(userCtx.evaluate("new-homepage")).toEqual(false);
    });

    it("returns true when the flag is enabled with no strategies", () => {
      const flagsConfig: FlagsConfiguration = [
        {
          key: "new-homepage",
          status: "enabled",
          strategies: [],
        },
      ];

      const engine = createFlagEngine(flagsConfig);
      const userCtx = engine.createUserContext({ __id: "yo" });
      expect(userCtx.evaluate("new-homepage")).toEqual(true);
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

      const engine = createFlagEngine(flagsConfig);
      const userCtx = engine.createUserContext({ __id: "yo" });
      expect(userCtx.evaluateAll()).toEqual({ "new-homepage": false });
    });

    it("returns true when the flag is enabled with no strategies", () => {
      const flagsConfig: FlagsConfiguration = [
        {
          key: "new-homepage",
          status: "enabled",
          strategies: [],
        },
      ];

      const engine = createFlagEngine(flagsConfig);
      const userCtx = engine.createUserContext({ __id: "yo" });
      expect(userCtx.evaluateAll()).toEqual({ "new-homepage": true });
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
                  value: ["marvin"],
                },
                {
                  field: "lastName",
                  operator: "contains",
                  value: ["frachet"],
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
                  value: ["US"],
                },
              ],
              variants: [],
            },
          ],
        },
      ];

      const engine = createFlagEngine(flagsConfig);
      const userCtx = engine.createUserContext({
        __id: "yo",
        firstName: "marvin",
        lastName: "frachet",
        country: "FR",
      });

      expect(userCtx.evaluateAll()).toEqual({ "new-homepage": true });
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
                  value: ["marvin"],
                },
                {
                  field: "lastName",
                  operator: "contains",
                  value: ["frachet"],
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
                  value: ["US"],
                },
              ],
              variants: [],
            },
          ],
        },
      ];

      const engine = createFlagEngine(flagsConfig);
      const userCtx = engine.createUserContext({
        __id: "yo",
        notMatching: "hello",
      });

      expect(userCtx.evaluateAll()).toEqual({ "new-homepage": false });
    });

    it("returns 'Control' variant when the flag is enabled and with __id being 'Ab'", () => {
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

      const engine = createFlagEngine(flagsConfig);
      const userCtx = engine.createUserContext({
        __id: "Ab",
        notMatching: "hello",
      });

      expect(userCtx.evaluateAll()).toEqual({ "new-homepage": "Control" });
    });

    it("returns 'B' variant when the flag is enabled and with __id being 'A'", () => {
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

      const engine = createFlagEngine(flagsConfig);
      const userCtx = engine.createUserContext({
        __id: "A",
        notMatching: "hello",
      });

      expect(userCtx.evaluateAll()).toEqual({ "new-homepage": "B" });
    });

    it("resolves the variants 'Control' of the matching strategy for the __id 'a,'", () => {
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
                  value: ["US"],
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
                  value: ["marvin"],
                },
                {
                  field: "lastName",
                  operator: "contains",
                  value: ["frachet"],
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

      const engine = createFlagEngine(flagsConfig);
      const userCtx = engine.createUserContext({
        __id: "a,",
        firstName: "marvin",
        lastName: "frachet",
        country: "FR",
      });

      expect(userCtx.evaluateAll()).toEqual({ "new-homepage": "Control" });
    });

    it("resolves the variants 'B' of the matching strategy for the __id 'A'", () => {
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
                  value: ["US"],
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
                  value: ["marvin"],
                },
                {
                  field: "lastName",
                  operator: "contains",
                  value: ["frachet"],
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

      const engine = createFlagEngine(flagsConfig);
      const userCtx = engine.createUserContext({
        __id: "A",
        firstName: "marvin",
        lastName: "frachet",
        country: "FR",
      });

      expect(userCtx.evaluateAll()).toEqual({ "new-homepage": "B" });
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
                  value: ["marvin"],
                },
                {
                  field: "lastName",
                  operator: "contains",
                  value: ["frachet"],
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

      const engine = createFlagEngine(flagsConfig);
      const userCtx = engine.createUserContext({
        __id: "yo",
        firstName: "marvin",
        lastName: "frachet",
        country: "FR",
      });

      expect(userCtx.evaluateAll()).toEqual({ "new-homepage": false });
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
                        value: ["F"],
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

      const engine = createFlagEngine(flagsConfig);
      const userCtx = engine.createUserContext({
        __id: "yo",
        firstName: "marvin",
        lastName: "frachet",
        country: "FR",
      });

      expect(userCtx.evaluateAll()).toEqual({ "new-homepage": true });
    });
  });

  describe("french or spain", () => {
    it("returns 'B' variant when the user is french and matches the strategy", () => {
      const flagsConfig: FlagsConfiguration = [
        {
          key: "feature-flag-key",
          status: "enabled", // the status of the flag, can be "enabled" or "disabled"
          strategies: [
            {
              name: "only-france-and-spain",
              rules: [
                {
                  field: "country",
                  operator: "equals",
                  value: ["France", "Spain"],
                },
              ],
              variants: [
                {
                  name: "A",
                  percent: 50,
                },
                {
                  name: "B",
                  percent: 50,
                },
              ],
            },
          ],
        },
      ];
      const engine = createFlagEngine(flagsConfig);
      const userCtx = engine.createUserContext({
        __id: "a",
        country: "France",
      });

      expect(userCtx.evaluateAll()).toEqual({ "feature-flag-key": "B" });
    });
  });

  describe("evaluate with strategies and variants", () => {
    it("returns variant name when calling evaluate() with strategies", () => {
      const flagsConfig: FlagsConfiguration = [
        {
          key: "my-flag",
          status: "enabled",
          strategies: [
            {
              name: "default",
              rules: [
                { field: "country", operator: "equals", value: ["FR"] },
              ],
              variants: [
                { name: "A", percent: 50 },
                { name: "B", percent: 50 },
              ],
            },
          ],
        },
      ];

      const engine = createFlagEngine(flagsConfig);
      const userCtx = engine.createUserContext({
        __id: "Ab",
        country: "FR",
      });

      const result = userCtx.evaluate("my-flag");
      expect(typeof result).toBe("string");
      expect(["A", "B"]).toContain(result);
    });

    it("returns true when calling evaluate() with eligible strategy but no variants", () => {
      const flagsConfig: FlagsConfiguration = [
        {
          key: "my-flag",
          status: "enabled",
          strategies: [
            {
              name: "default",
              rules: [
                { field: "country", operator: "equals", value: ["FR"] },
              ],
              variants: [],
            },
          ],
        },
      ];

      const engine = createFlagEngine(flagsConfig);
      const userCtx = engine.createUserContext({
        __id: "user-1",
        country: "FR",
      });

      expect(userCtx.evaluate("my-flag")).toBe(true);
    });

    it("returns false when calling evaluate() with non-eligible strategy", () => {
      const flagsConfig: FlagsConfiguration = [
        {
          key: "my-flag",
          status: "enabled",
          strategies: [
            {
              name: "default",
              rules: [
                { field: "country", operator: "equals", value: ["US"] },
              ],
              variants: [{ name: "A", percent: 100 }],
            },
          ],
        },
      ];

      const engine = createFlagEngine(flagsConfig);
      const userCtx = engine.createUserContext({
        __id: "user-1",
        country: "FR",
      });

      expect(userCtx.evaluate("my-flag")).toBe(false);
    });
  });

  describe("multiple flags in evaluateAll", () => {
    it("evaluates multiple flags returning a mix of true, false, and variants", () => {
      const flagsConfig: FlagsConfiguration = [
        {
          key: "flag-enabled-no-strategies",
          status: "enabled",
          strategies: [],
        },
        {
          key: "flag-disabled",
          status: "disabled",
          strategies: [],
        },
        {
          key: "flag-with-variants",
          status: "enabled",
          strategies: [
            {
              name: "default",
              rules: [],
              variants: [
                { name: "Control", percent: 50 },
                { name: "Treatment", percent: 50 },
              ],
            },
          ],
        },
        {
          key: "flag-not-eligible",
          status: "enabled",
          strategies: [
            {
              name: "default",
              rules: [
                { field: "country", operator: "equals", value: ["US"] },
              ],
              variants: [],
            },
          ],
        },
      ];

      const engine = createFlagEngine(flagsConfig);
      const userCtx = engine.createUserContext({
        __id: "user-1",
        country: "FR",
      });

      const result = userCtx.evaluateAll();
      expect(result["flag-enabled-no-strategies"]).toBe(true);
      expect(result["flag-disabled"]).toBe(false);
      expect(["Control", "Treatment"]).toContain(result["flag-with-variants"]);
      expect(result["flag-not-eligible"]).toBe(false);
    });
  });

  describe("setUserConfiguration with variant change", () => {
    it("changes variant assignment when user switches to a different id", () => {
      const flagsConfig: FlagsConfiguration = [
        {
          key: "ab-test",
          status: "enabled",
          strategies: [
            {
              name: "default",
              rules: [],
              variants: [
                { name: "A", percent: 50 },
                { name: "B", percent: 50 },
              ],
            },
          ],
        },
      ];

      const engine = createFlagEngine(flagsConfig);
      const userCtx = engine.createUserContext({ __id: "user-A" });

      const firstResult = userCtx.evaluate("ab-test");

      // Change to a different user — may get a different variant
      userCtx.setUserConfiguration({ __id: "user-B" });
      const secondResult = userCtx.evaluate("ab-test");

      // Both should be valid variants (we can't guarantee they differ, but they should be valid)
      expect(["A", "B"]).toContain(firstResult);
      expect(["A", "B"]).toContain(secondResult);
    });

    it("evaluateAll reflects new user configuration after setUserConfiguration", () => {
      const flagsConfig: FlagsConfiguration = [
        {
          key: "geo-flag",
          status: "enabled",
          strategies: [
            {
              name: "french-only",
              rules: [
                { field: "country", operator: "equals", value: ["FR"] },
              ],
              variants: [],
            },
          ],
        },
      ];

      const engine = createFlagEngine(flagsConfig);
      const userCtx = engine.createUserContext({
        __id: "user-1",
        country: "FR",
      });

      expect(userCtx.evaluateAll()).toEqual({ "geo-flag": true });

      userCtx.setUserConfiguration({ __id: "user-1", country: "US" });
      expect(userCtx.evaluateAll()).toEqual({ "geo-flag": false });
    });
  });

  describe("edge cases", () => {
    it("handles empty flags configuration", () => {
      const engine = createFlagEngine([]);
      const userCtx = engine.createUserContext({ __id: "user-1" });

      expect(userCtx.evaluateAll()).toEqual({});
      expect(userCtx.evaluate("non-existent")).toBe(false);
    });

    it("returns false for disabled flag even with matching strategies", () => {
      const flagsConfig: FlagsConfiguration = [
        {
          key: "my-flag",
          status: "disabled",
          strategies: [
            {
              name: "default",
              rules: [
                { field: "country", operator: "equals", value: ["FR"] },
              ],
              variants: [{ name: "A", percent: 100 }],
            },
          ],
        },
      ];

      const engine = createFlagEngine(flagsConfig);
      const userCtx = engine.createUserContext({
        __id: "user-1",
        country: "FR",
      });

      expect(userCtx.evaluate("my-flag")).toBe(false);
      expect(userCtx.evaluateAll()).toEqual({ "my-flag": false });
    });

    it("handles three or more strategies (first match semantics)", () => {
      const flagsConfig: FlagsConfiguration = [
        {
          key: "multi-strategy",
          status: "enabled",
          strategies: [
            {
              name: "first",
              rules: [
                { field: "country", operator: "equals", value: ["US"] },
              ],
              variants: [{ name: "FromFirst", percent: 100 }],
            },
            {
              name: "second",
              rules: [
                { field: "country", operator: "equals", value: ["FR"] },
              ],
              variants: [{ name: "FromSecond", percent: 100 }],
            },
            {
              name: "third",
              rules: [
                { field: "country", operator: "equals", value: ["FR", "US"] },
              ],
              variants: [{ name: "FromThird", percent: 100 }],
            },
          ],
        },
      ];

      const engine = createFlagEngine(flagsConfig);
      const userCtx = engine.createUserContext({
        __id: "user-1",
        country: "FR",
      });

      // Second strategy matches first (FR), third also matches but second wins
      expect(userCtx.evaluate("multi-strategy")).toBe("FromSecond");
    });

    it("segment rule that does not match the user", () => {
      const flagsConfig: FlagsConfiguration = [
        {
          key: "segment-flag",
          status: "enabled",
          strategies: [
            {
              name: "default",
              rules: [
                {
                  inSegment: {
                    name: "internal-users",
                    rules: [
                      {
                        field: "email",
                        operator: "contains",
                        value: ["@internal.com"],
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

      const engine = createFlagEngine(flagsConfig);
      const userCtx = engine.createUserContext({
        __id: "user-1",
        email: "user@external.com",
      });

      expect(userCtx.evaluate("segment-flag")).toBe(false);
      expect(userCtx.evaluateAll()).toEqual({ "segment-flag": false });
    });

    it("mixed segment and non-segment rules in same strategy", () => {
      const flagsConfig: FlagsConfiguration = [
        {
          key: "mixed-rules",
          status: "enabled",
          strategies: [
            {
              name: "default",
              rules: [
                {
                  inSegment: {
                    name: "french-segment",
                    rules: [
                      {
                        field: "country",
                        operator: "equals",
                        value: ["FR"],
                      },
                    ],
                  },
                },
                {
                  field: "age",
                  operator: "greater_than",
                  value: 18,
                },
              ],
              variants: [],
            },
          ],
        },
      ];

      const engine = createFlagEngine(flagsConfig);

      // Both match
      const ctx1 = engine.createUserContext({
        __id: "user-1",
        country: "FR",
        age: 25,
      });
      expect(ctx1.evaluate("mixed-rules")).toBe(true);

      // Segment matches, age doesn't
      const ctx2 = engine.createUserContext({
        __id: "user-2",
        country: "FR",
        age: 15,
      });
      expect(ctx2.evaluate("mixed-rules")).toBe(false);
    });
  });
});
