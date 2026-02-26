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

  // ── starts_with ──────────────────────────────────────────────────────

  it.each([
    ["hello world", ["hello"], true],
    ["hello world", ["world"], false],
    ["Hello", ["hello"], false], // case-sensitive
    ["hello", ["hi", "he"], true], // multiple values (OR)
    ["hello", ["hi", "wo"], false],
    ["", [""], true],
    ["hello", [""], true], // every string starts with ""
    ["hello", [], false], // empty array
    ["TypeScript", ["Type"], true],
    ["TypeScript", ["script"], false],
    ["TypeScript", ["TypeScript"], true], // exact match
    ["TypeScript", ["TypeScriptX"], false], // longer than field
    ["abc", ["a", "b", "c"], true],
    ["abc", ["d", "e", "f"], false],
  ])(
    "when field is '%s' and value is '%s', then it should return '%s' for operator starts_with",
    (userValue, ruleValue, expected) => {
      const rules: Rule[] = [
        {
          operator: "starts_with",
          field: "name",
          value: ruleValue,
        },
      ];

      expect(
        isEligibleForStrategy(rules, { __id: "yo", name: userValue })
      ).toBe(expected);
    }
  );

  it("starts_with returns false when field is non-string", () => {
    const rules: Rule[] = [
      { operator: "starts_with", field: "name", value: ["hello"] },
    ];
    expect(
      isEligibleForStrategy(rules, { __id: "yo", name: 42 })
    ).toBe(false);
  });

  it("starts_with returns false when field is missing", () => {
    const rules: Rule[] = [
      { operator: "starts_with", field: "name", value: ["hello"] },
    ];
    expect(isEligibleForStrategy(rules, { __id: "yo" })).toBe(false);
  });

  // ── ends_with ───────────────────────────────────────────────────────

  it.each([
    ["hello world", ["world"], true],
    ["hello world", ["hello"], false],
    ["Hello", ["LO"], false], // case-sensitive
    ["Hello", ["lo"], true],
    ["test.ts", [".js", ".ts"], true], // multiple values (OR)
    ["test.ts", [".js", ".py"], false],
    ["", [""], true],
    ["hello", [""], true], // every string ends with ""
    ["hello", [], false], // empty array
    ["TypeScript", ["Script"], true],
    ["TypeScript", ["Type"], false],
    ["TypeScript", ["TypeScript"], true], // exact match
    ["TypeScript", ["XTypeScript"], false], // longer than field
    ["abc", ["a", "b", "c"], true],
    ["abc", ["d", "e", "f"], false],
  ])(
    "when field is '%s' and value is '%s', then it should return '%s' for operator ends_with",
    (userValue, ruleValue, expected) => {
      const rules: Rule[] = [
        {
          operator: "ends_with",
          field: "name",
          value: ruleValue,
        },
      ];

      expect(
        isEligibleForStrategy(rules, { __id: "yo", name: userValue })
      ).toBe(expected);
    }
  );

  it("ends_with returns false when field is non-string", () => {
    const rules: Rule[] = [
      { operator: "ends_with", field: "name", value: [".com"] },
    ];
    expect(
      isEligibleForStrategy(rules, { __id: "yo", name: 42 })
    ).toBe(false);
  });

  it("ends_with returns false when field is missing", () => {
    const rules: Rule[] = [
      { operator: "ends_with", field: "name", value: [".com"] },
    ];
    expect(isEligibleForStrategy(rules, { __id: "yo" })).toBe(false);
  });

  // ── regex ───────────────────────────────────────────────────────────

  it.each([
    ["hello123", "\\d+", true],
    ["hello", "^\\d+$", false],
    ["2025-01-01", "^\\d{4}-\\d{2}-\\d{2}$", true],
    ["test@example.com", "@example\\.com$", true],
    ["test@example.org", "@example\\.com$", false],
    ["Hello", "^hello$", false], // case-sensitive by default
    ["hello", "^hello$", true],
    ["", ".*", true], // empty string matches .*
    ["abc", "^abc$", true],
    ["abc", "^ABC$", false],
    ["foo bar baz", "\\bbar\\b", true],
    ["foobarbaz", "\\bbar\\b", false],
    ["12345", "^\\d{5}$", true],
    ["1234", "^\\d{5}$", false],
  ])(
    "when field is '%s' and pattern is '%s', then it should return '%s' for operator regex",
    (userValue, ruleValue, expected) => {
      const rules: Rule[] = [
        {
          operator: "regex",
          field: "name",
          value: ruleValue,
        },
      ];

      expect(
        isEligibleForStrategy(rules, { __id: "yo", name: userValue })
      ).toBe(expected);
    }
  );

  it("regex returns false for invalid regex pattern", () => {
    const rules: Rule[] = [
      { operator: "regex", field: "name", value: "[invalid(" },
    ];
    expect(
      isEligibleForStrategy(rules, { __id: "yo", name: "test" })
    ).toBe(false);
  });

  it("regex returns false when field is non-string", () => {
    const rules: Rule[] = [
      { operator: "regex", field: "name", value: "\\d+" },
    ];
    expect(
      isEligibleForStrategy(rules, { __id: "yo", name: 42 })
    ).toBe(false);
  });

  it("regex returns false when field is missing", () => {
    const rules: Rule[] = [
      { operator: "regex", field: "name", value: "\\d+" },
    ];
    expect(isEligibleForStrategy(rules, { __id: "yo" })).toBe(false);
  });

  // ── greater_than_or_equal ───────────────────────────────────────────

  it.each([
    [5, 5, true], // equal
    [6, 5, true], // greater
    [4, 5, false], // less
    [0, 0, true],
    [-1, 0, false],
    [0, -1, true],
    [3.5, 3.5, true],
    [3.6, 3.5, true],
    [3.4, 3.5, false],
    [NaN, 0, false],
    [0, NaN, false],
    [Infinity, 100, true],
    [100, Infinity, false],
  ])(
    "when field is '%s' and rule value is '%s', then it should return '%s' for operator greater_than_or_equal",
    (userValue, ruleValue, expected) => {
      const rules: Rule[] = [
        {
          operator: "greater_than_or_equal",
          field: "score",
          value: ruleValue,
        },
      ];

      expect(
        isEligibleForStrategy(rules, { __id: "yo", score: userValue as number })
      ).toBe(expected);
    }
  );

  it("greater_than_or_equal returns false when field is non-number", () => {
    const rules: Rule[] = [
      { operator: "greater_than_or_equal", field: "score", value: 5 },
    ];
    expect(
      isEligibleForStrategy(rules, { __id: "yo", score: "5" })
    ).toBe(false);
  });

  it("greater_than_or_equal returns false when field is missing", () => {
    const rules: Rule[] = [
      { operator: "greater_than_or_equal", field: "score", value: 5 },
    ];
    expect(isEligibleForStrategy(rules, { __id: "yo" })).toBe(false);
  });

  // ── less_than_or_equal ──────────────────────────────────────────────

  it.each([
    [5, 5, true], // equal
    [4, 5, true], // less
    [6, 5, false], // greater
    [0, 0, true],
    [0, -1, false],
    [-1, 0, true],
    [3.5, 3.5, true],
    [3.4, 3.5, true],
    [3.6, 3.5, false],
    [NaN, 0, false],
    [0, NaN, false],
    [-Infinity, 0, true],
    [0, -Infinity, false],
  ])(
    "when field is '%s' and rule value is '%s', then it should return '%s' for operator less_than_or_equal",
    (userValue, ruleValue, expected) => {
      const rules: Rule[] = [
        {
          operator: "less_than_or_equal",
          field: "score",
          value: ruleValue,
        },
      ];

      expect(
        isEligibleForStrategy(rules, { __id: "yo", score: userValue as number })
      ).toBe(expected);
    }
  );

  it("less_than_or_equal returns false when field is non-number", () => {
    const rules: Rule[] = [
      { operator: "less_than_or_equal", field: "score", value: 5 },
    ];
    expect(
      isEligibleForStrategy(rules, { __id: "yo", score: "5" })
    ).toBe(false);
  });

  it("less_than_or_equal returns false when field is missing", () => {
    const rules: Rule[] = [
      { operator: "less_than_or_equal", field: "score", value: 5 },
    ];
    expect(isEligibleForStrategy(rules, { __id: "yo" })).toBe(false);
  });

  // ── date_before ─────────────────────────────────────────────────────

  it.each([
    ["2024-01-01T00:00:00Z", "2025-01-01T00:00:00Z", true],
    ["2026-01-01T00:00:00Z", "2025-01-01T00:00:00Z", false],
    ["2025-01-01T00:00:00Z", "2025-01-01T00:00:00Z", false], // same = not before
    ["2024-06-15", "2024-06-16", true], // date-only strings
    ["2024-06-16", "2024-06-15", false],
    ["2024-06-15", "2024-06-15", false],
    ["2020-12-31T23:59:59Z", "2021-01-01T00:00:00Z", true],
    ["2021-01-01T00:00:01Z", "2021-01-01T00:00:00Z", false],
  ])(
    "when field is '%s' and rule value is '%s', then it should return '%s' for operator date_before",
    (userValue, ruleValue, expected) => {
      const rules: Rule[] = [
        {
          operator: "date_before",
          field: "createdAt",
          value: ruleValue,
        },
      ];

      expect(
        isEligibleForStrategy(rules, { __id: "yo", createdAt: userValue })
      ).toBe(expected);
    }
  );

  it("date_before returns false for invalid user date", () => {
    const rules: Rule[] = [
      { operator: "date_before", field: "createdAt", value: "2025-01-01T00:00:00Z" },
    ];
    expect(
      isEligibleForStrategy(rules, { __id: "yo", createdAt: "not-a-date" })
    ).toBe(false);
  });

  it("date_before returns false for invalid rule date", () => {
    const rules: Rule[] = [
      { operator: "date_before", field: "createdAt", value: "not-a-date" },
    ];
    expect(
      isEligibleForStrategy(rules, { __id: "yo", createdAt: "2025-01-01T00:00:00Z" })
    ).toBe(false);
  });

  it("date_before returns false when field is non-string", () => {
    const rules: Rule[] = [
      { operator: "date_before", field: "createdAt", value: "2025-01-01T00:00:00Z" },
    ];
    expect(
      isEligibleForStrategy(rules, { __id: "yo", createdAt: 12345 })
    ).toBe(false);
  });

  it("date_before returns false when field is missing", () => {
    const rules: Rule[] = [
      { operator: "date_before", field: "createdAt", value: "2025-01-01T00:00:00Z" },
    ];
    expect(isEligibleForStrategy(rules, { __id: "yo" })).toBe(false);
  });

  // ── date_after ──────────────────────────────────────────────────────

  it.each([
    ["2026-01-01T00:00:00Z", "2025-01-01T00:00:00Z", true],
    ["2024-01-01T00:00:00Z", "2025-01-01T00:00:00Z", false],
    ["2025-01-01T00:00:00Z", "2025-01-01T00:00:00Z", false], // same = not after
    ["2024-06-16", "2024-06-15", true], // date-only strings
    ["2024-06-15", "2024-06-16", false],
    ["2021-01-01T00:00:01Z", "2021-01-01T00:00:00Z", true],
    ["2020-12-31T23:59:59Z", "2021-01-01T00:00:00Z", false],
  ])(
    "when field is '%s' and rule value is '%s', then it should return '%s' for operator date_after",
    (userValue, ruleValue, expected) => {
      const rules: Rule[] = [
        {
          operator: "date_after",
          field: "createdAt",
          value: ruleValue,
        },
      ];

      expect(
        isEligibleForStrategy(rules, { __id: "yo", createdAt: userValue })
      ).toBe(expected);
    }
  );

  it("date_after returns false for invalid user date", () => {
    const rules: Rule[] = [
      { operator: "date_after", field: "createdAt", value: "2025-01-01T00:00:00Z" },
    ];
    expect(
      isEligibleForStrategy(rules, { __id: "yo", createdAt: "not-a-date" })
    ).toBe(false);
  });

  it("date_after returns false for invalid rule date", () => {
    const rules: Rule[] = [
      { operator: "date_after", field: "createdAt", value: "not-a-date" },
    ];
    expect(
      isEligibleForStrategy(rules, { __id: "yo", createdAt: "2025-01-01T00:00:00Z" })
    ).toBe(false);
  });

  it("date_after returns false when field is non-string", () => {
    const rules: Rule[] = [
      { operator: "date_after", field: "createdAt", value: "2025-01-01T00:00:00Z" },
    ];
    expect(
      isEligibleForStrategy(rules, { __id: "yo", createdAt: 12345 })
    ).toBe(false);
  });

  it("date_after returns false when field is missing", () => {
    const rules: Rule[] = [
      { operator: "date_after", field: "createdAt", value: "2025-01-01T00:00:00Z" },
    ];
    expect(isEligibleForStrategy(rules, { __id: "yo" })).toBe(false);
  });

  // ── is_set ──────────────────────────────────────────────────────────

  it.each([
    ["hello", true], // string
    [42, true], // number
    [0, true], // zero
    [false, true], // boolean false
    ["", true], // empty string
    [true, true], // boolean true
    [null, false], // null
    [undefined, false], // undefined
  ])(
    "when field value is '%s', then it should return '%s' for operator is_set",
    (userValue, expected) => {
      const rules: Rule[] = [
        {
          operator: "is_set",
          field: "attr",
        },
      ];

      expect(
        isEligibleForStrategy(rules, { __id: "yo", attr: userValue as string })
      ).toBe(expected);
    }
  );

  it("is_set returns false when field is missing entirely", () => {
    const rules: Rule[] = [
      { operator: "is_set", field: "attr" },
    ];
    expect(isEligibleForStrategy(rules, { __id: "yo" })).toBe(false);
  });

  // ── is_not_set ──────────────────────────────────────────────────────

  it.each([
    ["hello", false], // string
    [42, false], // number
    [0, false], // zero
    [false, false], // boolean false
    ["", false], // empty string
    [true, false], // boolean true
    [null, true], // null
    [undefined, true], // undefined
  ])(
    "when field value is '%s', then it should return '%s' for operator is_not_set",
    (userValue, expected) => {
      const rules: Rule[] = [
        {
          operator: "is_not_set",
          field: "attr",
        },
      ];

      expect(
        isEligibleForStrategy(rules, { __id: "yo", attr: userValue as string })
      ).toBe(expected);
    }
  );

  it("is_not_set returns true when field is missing entirely", () => {
    const rules: Rule[] = [
      { operator: "is_not_set", field: "attr" },
    ];
    expect(isEligibleForStrategy(rules, { __id: "yo" })).toBe(true);
  });

  // ── modulo ──────────────────────────────────────────────────────────

  it.each([
    [10, 3, 1, true], // 10 % 3 === 1
    [10, 3, 0, false], // 10 % 3 !== 0
    [0, 5, 0, true], // 0 % 5 === 0
    [100, 10, 0, true], // 100 % 10 === 0
    [7, 2, 1, true], // 7 % 2 === 1
    [7, 2, 0, false],
    [15, 4, 3, true], // 15 % 4 === 3
    [-7, 3, -1, true], // JS: -7 % 3 === -1
    [-7, 3, 2, false],
    [99, 100, 99, true],
    [1, 1, 0, true], // any int % 1 === 0
  ])(
    "when field is %s and divisor is %s and remainder is %s, then it should return %s for operator modulo",
    (userValue, divisor, remainder, expected) => {
      const rules: Rule[] = [
        {
          operator: "modulo",
          field: "userId",
          value: { divisor, remainder },
        },
      ];

      expect(
        isEligibleForStrategy(rules, { __id: "yo", userId: userValue })
      ).toBe(expected);
    }
  );

  it("modulo returns false when divisor is 0 (NaN result)", () => {
    const rules: Rule[] = [
      { operator: "modulo", field: "userId", value: { divisor: 0, remainder: 0 } },
    ];
    expect(
      isEligibleForStrategy(rules, { __id: "yo", userId: 10 })
    ).toBe(false);
  });

  it("modulo returns false when field is non-number", () => {
    const rules: Rule[] = [
      { operator: "modulo", field: "userId", value: { divisor: 3, remainder: 1 } },
    ];
    expect(
      isEligibleForStrategy(rules, { __id: "yo", userId: "10" })
    ).toBe(false);
  });

  it("modulo returns false when field is missing", () => {
    const rules: Rule[] = [
      { operator: "modulo", field: "userId", value: { divisor: 3, remainder: 1 } },
    ];
    expect(isEligibleForStrategy(rules, { __id: "yo" })).toBe(false);
  });

  it("modulo returns false when field is NaN", () => {
    const rules: Rule[] = [
      { operator: "modulo", field: "userId", value: { divisor: 3, remainder: 0 } },
    ];
    expect(
      isEligibleForStrategy(rules, { __id: "yo", userId: NaN })
    ).toBe(false);
  });

  // ── semver_equal ─────────────────────────────────────────────────────

  it.each([
    ["1.0.0", "1.0.0", true],
    ["1.0.0", "2.0.0", false],
    ["1.2.3", "1.2.3", true],
    ["2.0.0", "1.0.0", false],
    ["1.0.0-alpha", "1.0.0-alpha", true],
    ["1.0.0-alpha", "1.0.0-beta", false],
    ["1.0.0-alpha", "1.0.0", false],
    ["1.0.0+build.1", "1.0.0+build.2", true], // build metadata ignored per semver spec
    ["1.0.0+build.1", "1.0.0", true], // build metadata ignored
    ["0.0.1", "0.0.1", true],
    ["10.20.30", "10.20.30", true],
    ["1.0.0-alpha.1", "1.0.0-alpha.1", true],
    ["1.0.0-alpha.1", "1.0.0-alpha.2", false],
  ])(
    "when field is '%s' and rule value is '%s', then it should return '%s' for operator semver_equal",
    (userValue, ruleValue, expected) => {
      const rules: Rule[] = [
        {
          operator: "semver_equal",
          field: "version",
          value: ruleValue,
        },
      ];

      expect(
        isEligibleForStrategy(rules, { __id: "yo", version: userValue })
      ).toBe(expected);
    }
  );

  it("semver_equal returns false for invalid user version", () => {
    const rules: Rule[] = [
      { operator: "semver_equal", field: "version", value: "1.0.0" },
    ];
    expect(
      isEligibleForStrategy(rules, { __id: "yo", version: "not-semver" })
    ).toBe(false);
  });

  it("semver_equal returns false for invalid rule version", () => {
    const rules: Rule[] = [
      { operator: "semver_equal", field: "version", value: "not-semver" },
    ];
    expect(
      isEligibleForStrategy(rules, { __id: "yo", version: "1.0.0" })
    ).toBe(false);
  });

  it("semver_equal returns false when field is non-string", () => {
    const rules: Rule[] = [
      { operator: "semver_equal", field: "version", value: "1.0.0" },
    ];
    expect(
      isEligibleForStrategy(rules, { __id: "yo", version: 100 })
    ).toBe(false);
  });

  it("semver_equal returns false when field is missing", () => {
    const rules: Rule[] = [
      { operator: "semver_equal", field: "version", value: "1.0.0" },
    ];
    expect(isEligibleForStrategy(rules, { __id: "yo" })).toBe(false);
  });

  // ── semver_greater_than ─────────────────────────────────────────────

  it.each([
    ["2.0.0", "1.0.0", true],
    ["1.0.0", "2.0.0", false],
    ["1.0.0", "1.0.0", false], // equal, not greater
    ["1.1.0", "1.0.0", true], // minor bump
    ["1.0.1", "1.0.0", true], // patch bump
    ["1.0.0", "1.0.0-alpha", true], // release > prerelease
    ["1.0.0-beta", "1.0.0-alpha", true], // prerelease ordering
    ["1.0.0-alpha", "1.0.0-beta", false],
    ["1.0.0-alpha.2", "1.0.0-alpha.1", true],
    ["10.0.0", "9.99.99", true],
    ["1.0.0+build.1", "1.0.0+build.2", false], // build metadata ignored, versions are equal
    ["0.0.2", "0.0.1", true],
  ])(
    "when field is '%s' and rule value is '%s', then it should return '%s' for operator semver_greater_than",
    (userValue, ruleValue, expected) => {
      const rules: Rule[] = [
        {
          operator: "semver_greater_than",
          field: "version",
          value: ruleValue,
        },
      ];

      expect(
        isEligibleForStrategy(rules, { __id: "yo", version: userValue })
      ).toBe(expected);
    }
  );

  it("semver_greater_than returns false for invalid user version", () => {
    const rules: Rule[] = [
      { operator: "semver_greater_than", field: "version", value: "1.0.0" },
    ];
    expect(
      isEligibleForStrategy(rules, { __id: "yo", version: "abc" })
    ).toBe(false);
  });

  it("semver_greater_than returns false for invalid rule version", () => {
    const rules: Rule[] = [
      { operator: "semver_greater_than", field: "version", value: "xyz" },
    ];
    expect(
      isEligibleForStrategy(rules, { __id: "yo", version: "2.0.0" })
    ).toBe(false);
  });

  it("semver_greater_than returns false when field is non-string", () => {
    const rules: Rule[] = [
      { operator: "semver_greater_than", field: "version", value: "1.0.0" },
    ];
    expect(
      isEligibleForStrategy(rules, { __id: "yo", version: 200 })
    ).toBe(false);
  });

  it("semver_greater_than returns false when field is missing", () => {
    const rules: Rule[] = [
      { operator: "semver_greater_than", field: "version", value: "1.0.0" },
    ];
    expect(isEligibleForStrategy(rules, { __id: "yo" })).toBe(false);
  });

  // ── semver_less_than ────────────────────────────────────────────────

  it.each([
    ["1.0.0", "2.0.0", true],
    ["2.0.0", "1.0.0", false],
    ["1.0.0", "1.0.0", false], // equal, not less
    ["1.0.0", "1.1.0", true], // minor bump
    ["1.0.0", "1.0.1", true], // patch bump
    ["1.0.0-alpha", "1.0.0", true], // prerelease < release
    ["1.0.0-alpha", "1.0.0-beta", true], // prerelease ordering
    ["1.0.0-beta", "1.0.0-alpha", false],
    ["1.0.0-alpha.1", "1.0.0-alpha.2", true],
    ["9.99.99", "10.0.0", true],
    ["1.0.0+build.1", "1.0.0+build.2", false], // build metadata ignored, versions are equal
    ["0.0.1", "0.0.2", true],
  ])(
    "when field is '%s' and rule value is '%s', then it should return '%s' for operator semver_less_than",
    (userValue, ruleValue, expected) => {
      const rules: Rule[] = [
        {
          operator: "semver_less_than",
          field: "version",
          value: ruleValue,
        },
      ];

      expect(
        isEligibleForStrategy(rules, { __id: "yo", version: userValue })
      ).toBe(expected);
    }
  );

  it("semver_less_than returns false for invalid user version", () => {
    const rules: Rule[] = [
      { operator: "semver_less_than", field: "version", value: "2.0.0" },
    ];
    expect(
      isEligibleForStrategy(rules, { __id: "yo", version: "abc" })
    ).toBe(false);
  });

  it("semver_less_than returns false for invalid rule version", () => {
    const rules: Rule[] = [
      { operator: "semver_less_than", field: "version", value: "xyz" },
    ];
    expect(
      isEligibleForStrategy(rules, { __id: "yo", version: "1.0.0" })
    ).toBe(false);
  });

  it("semver_less_than returns false when field is non-string", () => {
    const rules: Rule[] = [
      { operator: "semver_less_than", field: "version", value: "2.0.0" },
    ];
    expect(
      isEligibleForStrategy(rules, { __id: "yo", version: 100 })
    ).toBe(false);
  });

  it("semver_less_than returns false when field is missing", () => {
    const rules: Rule[] = [
      { operator: "semver_less_than", field: "version", value: "2.0.0" },
    ];
    expect(isEligibleForStrategy(rules, { __id: "yo" })).toBe(false);
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
          operator: "unknown_op" as "equals",
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
