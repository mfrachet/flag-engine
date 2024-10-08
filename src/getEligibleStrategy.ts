import { FlagConfiguration, Strategy, UserConfiguration } from "./types";

const isEligibleForStrategy = (
  strategy: Strategy,
  userConfiguration: UserConfiguration
) => {
  if (strategy.rules.length === 0) return true;

  return strategy.rules.every((rule) => {
    switch (rule.operator) {
      case "equals":
        return userConfiguration[rule.field] === rule.value;

      case "not_equals":
        return userConfiguration[rule.field] !== rule.value;

      case "greater_than": {
        const fieldValue = userConfiguration[rule.field];

        return (
          typeof fieldValue === "number" &&
          typeof rule.value === "number" &&
          fieldValue > rule.value
        );
      }

      case "less_than": {
        const fieldValue = userConfiguration[rule.field];

        return (
          typeof fieldValue === "number" &&
          typeof rule.value === "number" &&
          fieldValue < rule.value
        );
      }

      case "contains": {
        const fieldValue = userConfiguration[rule.field];

        return (
          typeof fieldValue === "string" &&
          typeof rule.value === "string" &&
          fieldValue.includes(rule.value)
        );
      }

      case "not_contains": {
        const fieldValue = userConfiguration[rule.field];

        return (
          typeof fieldValue === "string" &&
          typeof rule.value === "string" &&
          !fieldValue.includes(rule.value)
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
    isEligibleForStrategy(strategy, userConfiguration)
  );
};
