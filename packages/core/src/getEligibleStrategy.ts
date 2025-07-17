import { FlagConfiguration, Rule, UserConfiguration } from "./types";

const isString = (value: unknown): value is string => typeof value === "string";

const isUndefined = (value: unknown): value is undefined =>
  typeof value === "undefined" || value === null;

export const isEligibleForStrategy = (
  rules: Rule[],
  userConfiguration: UserConfiguration
): boolean => {
  if (rules.length === 0) return true;

  return rules.every((rule) => {
    if ("inSegment" in rule) {
      return isEligibleForStrategy(rule.inSegment.rules, userConfiguration);
    }

    switch (rule.operator) {
      case "equals":
        return userConfiguration[rule.field] === rule.value;

      case "not_equals":
        return userConfiguration[rule.field] !== rule.value;

      case "greater_than": {
        const fieldValue = userConfiguration[rule.field];

        if (isUndefined(fieldValue) || isUndefined(rule.value)) return false;

        return fieldValue! > rule.value!;
      }

      case "less_than": {
        const fieldValue = userConfiguration[rule.field];

        if (isUndefined(fieldValue) || isUndefined(rule.value)) return false;

        return fieldValue! < rule.value!;
      }

      case "contains": {
        const fieldValue = userConfiguration[rule.field];

        return (
          isString(fieldValue) &&
          isString(rule.value) &&
          fieldValue.includes(rule.value)
        );
      }

      case "not_contains": {
        const fieldValue = userConfiguration[rule.field];

        return (
          isString(fieldValue) &&
          isString(rule.value) &&
          !fieldValue.includes(rule.value)
        );
      }

      case "in": {
        const fieldValue = userConfiguration[rule.field];

        return (
          Array.isArray(rule.value) && rule.value.indexOf(fieldValue) !== -1
        );
      }

      case "not_in": {
        const fieldValue = userConfiguration[rule.field];

        return (
          Array.isArray(rule.value) && rule.value.indexOf(fieldValue) === -1
        );
      }

      default:
        return false;
    }
  });
};

export const getEligibleStrategy = (
  flagConfig: FlagConfiguration,
  userConfiguration: UserConfiguration
) => {
  return flagConfig.strategies.find((strategy) =>
    isEligibleForStrategy(strategy.rules, userConfiguration)
  );
};
