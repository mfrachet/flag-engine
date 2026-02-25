import { describe, expect, it } from "vitest";
import { evaluateFlag } from "../evaluateFlag";
import { FlagConfiguration, UserConfiguration } from "../types";

describe("evaluateFlag", () => {
  const user: UserConfiguration = {
    __id: "user-1",
    country: "FR",
  };

  it("returns true when the flag has no strategies", () => {
    const flag: FlagConfiguration = {
      key: "my-flag",
      status: "enabled",
      strategies: [],
    };

    expect(evaluateFlag(flag, user)).toBe(true);
  });

  it("returns false when no strategy is eligible", () => {
    const flag: FlagConfiguration = {
      key: "my-flag",
      status: "enabled",
      strategies: [
        {
          name: "default",
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
    };

    expect(evaluateFlag(flag, user)).toBe(false);
  });

  it("returns true when an eligible strategy has no variants", () => {
    const flag: FlagConfiguration = {
      key: "my-flag",
      status: "enabled",
      strategies: [
        {
          name: "default",
          rules: [
            {
              field: "country",
              operator: "equals",
              value: ["FR"],
            },
          ],
          variants: [],
        },
      ],
    };

    expect(evaluateFlag(flag, user)).toBe(true);
  });

  it("returns variant name when an eligible strategy has matching variants", () => {
    const flag: FlagConfiguration = {
      key: "my-flag",
      status: "enabled",
      strategies: [
        {
          name: "default",
          rules: [
            {
              field: "country",
              operator: "equals",
              value: ["FR"],
            },
          ],
          variants: [
            { name: "A", percent: 50 },
            { name: "B", percent: 50 },
          ],
        },
      ],
    };

    const result = evaluateFlag(flag, user);
    expect(typeof result).toBe("string");
    expect(["A", "B"]).toContain(result);
  });

  it("returns false when eligible strategy has variants but all at 0%", () => {
    const flag: FlagConfiguration = {
      key: "my-flag",
      status: "enabled",
      strategies: [
        {
          name: "default",
          rules: [
            {
              field: "country",
              operator: "equals",
              value: ["FR"],
            },
          ],
          variants: [
            { name: "A", percent: 0 },
            { name: "B", percent: 0 },
          ],
        },
      ],
    };

    expect(evaluateFlag(flag, user)).toBe(false);
  });

  it("uses the first eligible strategy when multiple match", () => {
    const flag: FlagConfiguration = {
      key: "my-flag",
      status: "enabled",
      strategies: [
        {
          name: "first",
          rules: [
            {
              field: "country",
              operator: "equals",
              value: ["FR"],
            },
          ],
          variants: [{ name: "FromFirst", percent: 100 }],
        },
        {
          name: "second",
          rules: [
            {
              field: "country",
              operator: "equals",
              value: ["FR"],
            },
          ],
          variants: [{ name: "FromSecond", percent: 100 }],
        },
      ],
    };

    // evaluateFlag uses getEligibleStrategy which calls .find(), so first match wins
    expect(evaluateFlag(flag, user)).toBe("FromFirst");
  });
});
