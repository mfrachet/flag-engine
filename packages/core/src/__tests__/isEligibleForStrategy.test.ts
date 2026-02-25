import { describe, expect, it } from "vitest";
import { isEligibleForStrategy } from "../getEligibleStrategy";
import { Rule, UserConfiguration } from "../types";

describe("isEligibleForStrategy", () => {
  it.each([
    [[1], 1, true],
    [[1], "1", false],
    [[null], null, true],
    [[undefined], undefined, true],
    [[NaN], NaN, false],
    [[0], -0, true],
    [[0], 0, true],
    [["hello"], "hello", true],
    [["hello"], "world", false],
    [[true], true, true],
    [[true], false, false],
    [[false], false, true],
    [[42], 42, true],
    [[42], "42", false],
    [[undefined], null, false],
    [["FR", "US"], "FR", true],
    [["FR", "US"], "US", true],
    [["FR", "US"], "DE", false],
    [[], "anything", false],
    [[1, "1"], "1", true],
    [[1, "1"], 1, true],
    [[1, "1"], 2, false],
  ])(
    "when value is '%s' and country is '%s', then it should return '%s' for operator equals",
    (ruleValue, country, expected) => {
      const rules: Rule[] = [
        {
          operator: "equals",
          field: "country",
          value: ruleValue as Extract<Rule, { operator: "equals" }>["value"],
        },
      ];

      const userConfiguration: UserConfiguration = {
        country: country as string,
        __id: "yo",
      };

      expect(isEligibleForStrategy(rules, userConfiguration)).toBe(expected);
    }
  );

  it.each([
    [[1], 1, false],
    [[1], "1", true],
    [[null], null, false],
    [[undefined], undefined, false],
    [[NaN], NaN, true],
    [[0], -0, false],
    [[0], 0, false],
    [["hello"], "hello", false],
    [["hello"], "world", true],
    [[true], true, false],
    [[true], false, true],
    [[false], false, false],
    [[42], 42, false],
    [[42], "42", true],
    [[undefined], null, true],
    [["FR", "US"], "FR", false],
    [["FR", "US"], "US", false],
    [["FR", "US"], "DE", true],
    [[], "anything", true],
    [[1, "1"], "1", false],
    [[1, "1"], 2, true],
  ])(
    "when value is '%s' and country is '%s', then it should return '%s' for operator not_equals",
    (ruleValue, country, expected) => {
      const rules: Rule[] = [
        {
          operator: "not_equals",
          field: "country",
          value: ruleValue as Extract<Rule, { operator: "not_equals" }>["value"],
        },
      ];

      const userConfiguration: UserConfiguration = {
        country: country as string,
        __id: "yo",
      };

      expect(isEligibleForStrategy(rules, userConfiguration)).toBe(expected);
    }
  );

  it.each([
    [2, 1, true],
    [1, 2, false],
    [5, 5, false],
    [0, -1, true],
    [-1, 0, false],
    [3.5, 2.5, true],
    [100, 99, true],
    [99, 100, false],
    [NaN, 0, false],
    [3, NaN, false],
    ["hello", 5, false],
    [null, 0, false],
    [undefined, 0, false],
    [true, 0, false],
  ])(
    "when field is '%s' and rule value is '%s', then it should return '%s' for operator greater_than",
    (userValue, ruleValue, expected) => {
      const rules: Rule[] = [
        {
          operator: "greater_than",
          field: "country",
          value: ruleValue,
        },
      ];

      const userConfiguration: UserConfiguration = {
        country: userValue as string,
        __id: "yo",
      };

      expect(isEligibleForStrategy(rules, userConfiguration)).toBe(expected);
    }
  );

  it.each([
    [1, 2, true],
    [2, 1, false],
    [5, 5, false],
    [-1, 0, true],
    [0, -1, false],
    [2.5, 3.5, true],
    [99, 100, true],
    [100, 99, false],
    [NaN, 0, false],
    [0, NaN, false],
    ["hello", 5, false],
    [null, 0, false],
    [undefined, 0, false],
    [true, 0, false],
  ])(
    "when field is '%s' and rule value is '%s', then it should return '%s' for operator less_than",
    (userValue, ruleValue, expected) => {
      const rules: Rule[] = [
        {
          operator: "less_than",
          field: "country",
          value: ruleValue,
        },
      ];

      const userConfiguration: UserConfiguration = {
        country: userValue as string,
        __id: "yo",
      };

      expect(isEligibleForStrategy(rules, userConfiguration)).toBe(expected);
    }
  );

  it.each([
    ["hello world", ["world"], true],
    ["hello world", ["planet"], false],
    ["apple pie", ["apple"], true],
    ["apple pie", ["pie"], true],
    ["apple pie", ["banana"], false],
    ["JavaScript", ["script"], false], // case-sensitive
    ["JavaScript", ["Script"], true],
    ["", [""], true], // empty string contains an empty string
    ["hello", [""], true], // any string contains an empty string
    ["open source", ["open"], true],
    ["case sensitive", ["Case"], false],
    ["The quick brown fox", ["fox"], true],
    ["The quick brown fox", ["dog"], false],
    ["coding", ["code"], false],
    ["coding", ["ing"], true],
    ["Paris", ["is"], true],
    ["hello world", ["world", "planet"], true],
    ["hello world", ["planet", "mars"], false],
    ["apple pie", ["banana", "pie"], true],
    ["coding", ["code", "ing"], true],
    ["coding", ["code", "xyz"], false],
    ["hello world", [], false],
  ])(
    "when field is '%s' and value is '%s', then it should return '%s' for operator contains",
    (userValue, ruleValue, expected) => {
      const rules: Rule[] = [
        {
          operator: "contains",
          field: "country",
          value: ruleValue,
        },
      ];

      const userConfiguration: UserConfiguration = {
        country: userValue,
        __id: "yo",
      };

      expect(isEligibleForStrategy(rules, userConfiguration)).toBe(expected);
    }
  );

  it.each([
    ["hello world", ["planet"], true],
    ["hello world", ["world"], false],
    ["apple pie", ["banana"], true],
    ["apple pie", ["apple"], false],
    ["JavaScript", ["script"], true], // case-sensitive
    ["JavaScript", ["Script"], false],
    ["", ["hello"], true], // empty string does not contain any non-empty string
    ["hello", [""], false], // any string contains an empty string
    ["open source", ["closed"], true],
    ["case sensitive", ["Case"], true],
    ["The quick brown fox", ["dog"], true],
    ["The quick brown fox", ["fox"], false],
    ["coding", ["code"], true],
    ["coding", ["ing"], false],
    ["Paris", ["London"], true],
    ["Paris", ["is"], false],
    ["hello world", ["planet", "mars"], true],
    ["hello world", ["world", "mars"], false],
    ["hello world", ["planet", "world"], false],
    ["coding", ["xyz", "abc"], true],
    ["hello world", [], true],
  ])(
    "when field is '%s' and value is '%s', then it should return '%s' for operator not_contains",
    (userValue, ruleValue, expected) => {
      const rules: Rule[] = [
        {
          operator: "not_contains",
          field: "country",
          value: ruleValue,
        },
      ];

      const userConfiguration: UserConfiguration = {
        country: userValue,
        __id: "yo",
      };

      expect(isEligibleForStrategy(rules, userConfiguration)).toBe(expected);
    }
  );

  it("not_contains returns true when the field is missing from user configuration", () => {
    const rules: Rule[] = [
      {
        operator: "not_contains",
        field: "email",
        value: ["@competitor.com"],
      },
    ];

    const userConfiguration: UserConfiguration = {
      __id: "yo",
    };

    expect(isEligibleForStrategy(rules, userConfiguration)).toBe(true);
  });

  it("not_contains returns true when the field is a non-string value", () => {
    const rules: Rule[] = [
      {
        operator: "not_contains",
        field: "email",
        value: ["@competitor.com"],
      },
    ];

    const userConfiguration: UserConfiguration = {
      __id: "yo",
      email: 42,
    };

    expect(isEligibleForStrategy(rules, userConfiguration)).toBe(true);
  });

  it("contains returns false when the field is a non-string value", () => {
    const rules: Rule[] = [
      {
        operator: "contains",
        field: "email",
        value: ["@example.com"],
      },
    ];

    const userConfiguration: UserConfiguration = {
      __id: "yo",
      email: 42,
    };

    expect(isEligibleForStrategy(rules, userConfiguration)).toBe(false);
  });

  it("contains skips non-string entries in the value array", () => {
    const rules: Rule[] = [
      {
        operator: "contains",
        field: "email",
        value: [42 as unknown as string, "example"],
      },
    ];

    const userConfiguration: UserConfiguration = {
      __id: "yo",
      email: "test@example.com",
    };

    expect(isEligibleForStrategy(rules, userConfiguration)).toBe(true);
  });

  describe("missing field from user configuration", () => {
    it("equals returns false when field is missing", () => {
      const rules: Rule[] = [
        { operator: "equals", field: "country", value: ["FR"] },
      ];
      expect(
        isEligibleForStrategy(rules, { __id: "yo" })
      ).toBe(false);
    });

    it("not_equals returns true when field is missing (undefined not in array)", () => {
      const rules: Rule[] = [
        { operator: "not_equals", field: "country", value: ["FR"] },
      ];
      expect(
        isEligibleForStrategy(rules, { __id: "yo" })
      ).toBe(true);
    });

    it("greater_than returns false when field is missing", () => {
      const rules: Rule[] = [
        { operator: "greater_than", field: "age", value: 18 },
      ];
      expect(
        isEligibleForStrategy(rules, { __id: "yo" })
      ).toBe(false);
    });

    it("less_than returns false when field is missing", () => {
      const rules: Rule[] = [
        { operator: "less_than", field: "age", value: 18 },
      ];
      expect(
        isEligibleForStrategy(rules, { __id: "yo" })
      ).toBe(false);
    });

    it("contains returns false when field is missing", () => {
      const rules: Rule[] = [
        { operator: "contains", field: "email", value: ["@example.com"] },
      ];
      expect(
        isEligibleForStrategy(rules, { __id: "yo" })
      ).toBe(false);
    });
  });

  describe("multiple rules (AND semantics)", () => {
    it("returns true when all rules match", () => {
      const rules: Rule[] = [
        { operator: "equals", field: "country", value: ["FR"] },
        { operator: "contains", field: "email", value: ["@example.com"] },
      ];
      expect(
        isEligibleForStrategy(rules, {
          __id: "yo",
          country: "FR",
          email: "test@example.com",
        })
      ).toBe(true);
    });

    it("returns false when first rule matches but second does not", () => {
      const rules: Rule[] = [
        { operator: "equals", field: "country", value: ["FR"] },
        { operator: "contains", field: "email", value: ["@competitor.com"] },
      ];
      expect(
        isEligibleForStrategy(rules, {
          __id: "yo",
          country: "FR",
          email: "test@example.com",
        })
      ).toBe(false);
    });

    it("returns false when no rules match", () => {
      const rules: Rule[] = [
        { operator: "equals", field: "country", value: ["US"] },
        { operator: "greater_than", field: "age", value: 30 },
      ];
      expect(
        isEligibleForStrategy(rules, {
          __id: "yo",
          country: "FR",
          age: 25,
        })
      ).toBe(false);
    });

    it("returns true with mixed operator types all matching", () => {
      const rules: Rule[] = [
        { operator: "equals", field: "country", value: ["FR", "US"] },
        { operator: "greater_than", field: "age", value: 18 },
        { operator: "contains", field: "email", value: ["@company.com"] },
        { operator: "not_equals", field: "role", value: ["banned"] },
      ];
      expect(
        isEligibleForStrategy(rules, {
          __id: "yo",
          country: "FR",
          age: 25,
          email: "user@company.com",
          role: "admin",
        })
      ).toBe(true);
    });
  });

  describe("segment edge cases", () => {
    it("segment with empty rules returns true", () => {
      const rules: Rule[] = [
        {
          inSegment: {
            name: "everyone",
            rules: [],
          },
        },
      ];
      expect(
        isEligibleForStrategy(rules, { __id: "yo" })
      ).toBe(true);
    });

    it("mixed segment and field rules (both match)", () => {
      const rules: Rule[] = [
        {
          inSegment: {
            name: "french-segment",
            rules: [
              { field: "country", operator: "equals", value: ["FR"] },
            ],
          },
        },
        { operator: "greater_than", field: "age", value: 18 },
      ];
      expect(
        isEligibleForStrategy(rules, {
          __id: "yo",
          country: "FR",
          age: 25,
        })
      ).toBe(true);
    });

    it("mixed segment and field rules (segment fails)", () => {
      const rules: Rule[] = [
        {
          inSegment: {
            name: "french-segment",
            rules: [
              { field: "country", operator: "equals", value: ["FR"] },
            ],
          },
        },
        { operator: "greater_than", field: "age", value: 18 },
      ];
      expect(
        isEligibleForStrategy(rules, {
          __id: "yo",
          country: "US",
          age: 25,
        })
      ).toBe(false);
    });

    it("mixed segment and field rules (field rule fails)", () => {
      const rules: Rule[] = [
        {
          inSegment: {
            name: "french-segment",
            rules: [
              { field: "country", operator: "equals", value: ["FR"] },
            ],
          },
        },
        { operator: "greater_than", field: "age", value: 18 },
      ];
      expect(
        isEligibleForStrategy(rules, {
          __id: "yo",
          country: "FR",
          age: 15,
        })
      ).toBe(false);
    });

    it("segment that does not match user", () => {
      const rules: Rule[] = [
        {
          inSegment: {
            name: "beta-testers",
            rules: [
              { field: "email", operator: "contains", value: ["@internal.com"] },
            ],
          },
        },
      ];
      expect(
        isEligibleForStrategy(rules, {
          __id: "yo",
          email: "user@external.com",
        })
      ).toBe(false);
    });
  });

  describe("greater_than / less_than edge cases", () => {
    it("greater_than with Infinity", () => {
      const rules: Rule[] = [
        { operator: "greater_than", field: "score", value: 100 },
      ];
      expect(
        isEligibleForStrategy(rules, { __id: "yo", score: Infinity })
      ).toBe(true);
    });

    it("less_than with -Infinity", () => {
      const rules: Rule[] = [
        { operator: "less_than", field: "score", value: 0 },
      ];
      expect(
        isEligibleForStrategy(rules, { __id: "yo", score: -Infinity })
      ).toBe(true);
    });

    it("greater_than with Infinity as rule value", () => {
      const rules: Rule[] = [
        { operator: "greater_than", field: "score", value: Infinity },
      ];
      expect(
        isEligibleForStrategy(rules, { __id: "yo", score: 999999 })
      ).toBe(false);
    });
  });

  describe("unknown operator at runtime", () => {
    it("returns false for an unknown operator", () => {
      const rules = [
        {
          operator: "starts_with" as "equals",
          field: "name",
          value: ["test"],
        },
      ] as Rule[];

      expect(
        isEligibleForStrategy(rules, { __id: "yo", name: "test-user" })
      ).toBe(false);
    });
  });

  describe("segment depth protection", () => {
    const buildNestedSegment = (depth: number): Rule => {
      let innermost: Rule = {
        field: "country",
        operator: "equals",
        value: ["FR"],
      };

      for (let i = 0; i < depth; i++) {
        innermost = {
          inSegment: {
            name: `segment-${i}`,
            rules: [innermost],
          },
        };
      }

      return innermost;
    };

    it("returns false when segment nesting exceeds MAX_SEGMENT_DEPTH (10)", () => {
      const deepRule = buildNestedSegment(11);

      const userConfiguration: UserConfiguration = {
        __id: "yo",
        country: "FR",
      };

      expect(isEligibleForStrategy([deepRule], userConfiguration)).toBe(false);
    });

    it("returns true when segment nesting is exactly at MAX_SEGMENT_DEPTH (10)", () => {
      const deepRule = buildNestedSegment(10);

      const userConfiguration: UserConfiguration = {
        __id: "yo",
        country: "FR",
      };

      expect(isEligibleForStrategy([deepRule], userConfiguration)).toBe(true);
    });

    it("returns false when segment nesting is at MAX_SEGMENT_DEPTH but rule doesn't match", () => {
      const deepRule = buildNestedSegment(10);

      const userConfiguration: UserConfiguration = {
        __id: "yo",
        country: "US",
      };

      expect(isEligibleForStrategy([deepRule], userConfiguration)).toBe(false);
    });
  });
});
