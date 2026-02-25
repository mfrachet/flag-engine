import { FlagConfiguration, Rule, Strategy, UserConfiguration } from "./types";

const MAX_SEGMENT_DEPTH = 10;

const isString = (value: unknown): value is string => typeof value === "string";

/**
 * Evaluates whether a user matches all rules in a strategy.
 * Supports nested segment evaluation with cycle/depth protection.
 *
 * @param rules - Array of rules to evaluate
 * @param userConfiguration - User context with __id and custom fields
 * @param depth - Current recursion depth for cycle protection
 * @returns true if user matches all rules, false otherwise
 */
export const isEligibleForStrategy = (
  rules: Rule[],
  userConfiguration: UserConfiguration,
  depth: number = 0
): boolean => {
  // Prevent stack overflow from circular segment references
  if (depth > MAX_SEGMENT_DEPTH) {
    return false;
  }

  if (rules.length === 0) return true;

  return rules.every((rule) => {
    if ("inSegment" in rule) {
      return isEligibleForStrategy(
        rule.inSegment.rules,
        userConfiguration,
        depth + 1
      );
    }

    switch (rule.operator) {
      case "equals":
        return rule.value.indexOf(userConfiguration[rule.field]) !== -1;

      case "not_equals":
        return rule.value.indexOf(userConfiguration[rule.field]) === -1;

      case "greater_than": {
        const fieldValue = userConfiguration[rule.field];

        if (typeof fieldValue !== "number") return false;

        return fieldValue > rule.value;
      }

      case "less_than": {
        const fieldValue = userConfiguration[rule.field];

        if (typeof fieldValue !== "number") return false;

        return fieldValue < rule.value;
      }

      case "contains": {
        const fieldValue = userConfiguration[rule.field];

        if (!isString(fieldValue)) return false;
        return rule.value.some((v) => fieldValue.includes(v));
      }

      case "not_contains": {
        const fieldValue = userConfiguration[rule.field];

        if (!isString(fieldValue)) return true;
        return rule.value.every((v) => !fieldValue.includes(v));
      }

      default:
        return false;
    }
  });
};

/**
 * Finds the first strategy in a flag configuration that the user is eligible for.
 *
 * @param flagConfig - The flag configuration containing strategies
 * @param userConfiguration - User context with __id and custom fields
 * @returns The first matching strategy, or undefined if none match
 */
export const getEligibleStrategy = (
  flagConfig: FlagConfiguration,
  userConfiguration: UserConfiguration
): Strategy | undefined => {
  return flagConfig.strategies.find((strategy) =>
    isEligibleForStrategy(strategy.rules, userConfiguration)
  );
};
