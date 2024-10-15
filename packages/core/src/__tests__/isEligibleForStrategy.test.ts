import { describe, expect, it } from "vitest";
import { isEligibleForStrategy } from "../getEligibleStrategy";
import { Rule, UserConfiguration } from "../types";

describe("isEligibleForStrategy", () => {
  it.each([
    [1, 1, true],
    [1, "1", false],
    [null, null, true],
    [undefined, undefined, true],
    [NaN, NaN, false],
    [0, -0, true],
    [0, 0, true],
    ["hello", "hello", true],
    ["hello", "world", false],
    [true, true, true],
    [true, false, false],
    [false, false, true],
    [{}, {}, false],
    [[], [], false],
    [[1, 2], [1, 2], false],
    [42, 42, true],
    [42, "42", false],
    [{ key: "value" }, { key: "value" }, false],
    [new Date(2024, 0, 1), new Date(2024, 0, 1), false],
    [undefined, null, false],
  ])(
    "when field is '%s' and country is '%s', then it should return '%s' for operator equals",
    (fieldValue, country, expected) => {
      const rules: Rule[] = [
        {
          operator: "equals",
          field: "country",
          value: fieldValue,
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
    [1, 1, false],
    [1, "1", true],
    [null, null, false],
    [undefined, undefined, false],
    [NaN, NaN, true],
    [0, -0, false],
    [0, 0, false],
    ["hello", "hello", false],
    ["hello", "world", true],
    [true, true, false],
    [true, false, true],
    [false, false, false],
    [{}, {}, true],
    [[], [], true],
    [[1, 2], [1, 2], true],
    [42, 42, false],
    [42, "42", true],
    [{ key: "value" }, { key: "value" }, true],
    [new Date(2024, 0, 1), new Date(2024, 0, 1), true],
    [undefined, null, true],
  ])(
    "when field is '%s' and country is '%s', then it should return '%s' for operator not_equals",
    (fieldValue, country, expected) => {
      const rules: Rule[] = [
        {
          operator: "not_equals",
          field: "country",
          value: fieldValue,
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
    ["b", "a", true],
    ["a", "b", false],
    ["apple", "Apple", true],
    [true, false, true],
    [false, true, false],
    [10, "5", true], // numeric comparison
    ["10", 5, true], // lexicographic comparison
    [undefined, 0, false],
    [null, 0, false],
    [null, -1, false],
    [undefined, undefined, false],
    [NaN, 0, false],
    [3, NaN, false],
    ["z", "a", true],
    ["hello", "world", false],
    [100, 99, true],
    ["100", "99", false],
    [new Date("2024-01-01"), new Date("2023-12-31"), true],
    [new Date("2023-12-31"), new Date("2024-01-01"), false],
    [new Date("2024-01-01"), new Date("2024-01-01"), false],
    [new Date("2023-06-15"), new Date("2023-06-14"), true],
    [new Date("2022-06-15"), new Date("2023-06-15"), false],
  ])(
    "when field is '%s' and country is '%s', then it should return '%s' for operator greater_than",
    (userValue, ruleValue, expected) => {
      const rules: Rule[] = [
        {
          operator: "greater_than",
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
    [1, 2, true],
    [2, 1, false],
    [5, 5, false],
    [-1, 0, true],
    [0, -1, false],
    [2.5, 3.5, true],
    ["a", "b", true],
    ["b", "a", false],
    ["Apple", "apple", true],
    [false, true, true],
    [true, false, false],
    ["5", 10, true], // lexicographic comparison
    [5, "10", true], // numeric comparison
    [null, 0, false],
    [0, null, false],
    [undefined, null, false],
    [0, undefined, false],
    [NaN, 0, false],
    [0, NaN, false],
    ["a", "z", true],
    ["world", "hello", false],
    [99, 100, true],
    ["99", "100", false],
    [new Date("2023-12-31"), new Date("2024-01-01"), true],
    [new Date("2024-01-01"), new Date("2023-12-31"), false],
    [new Date("2024-01-01"), new Date("2024-01-01"), false],
    [new Date("2023-06-14"), new Date("2023-06-15"), true],
    [new Date("2023-06-15"), new Date("2022-06-15"), false],
  ])(
    "when field is '%s' and country is '%s', then it should return '%s' for operator less_than",
    (userValue, ruleValue, expected) => {
      const rules: Rule[] = [
        {
          operator: "less_than",
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
});
