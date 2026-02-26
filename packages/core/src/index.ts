import { evaluateFlag } from "./evaluateFlag";
import {
  EvaluationMachine,
  FlagDict,
  FlagsConfiguration,
  UserConfiguration,
  UserContextFlagEvaluation,
} from "./types";

const createUserContext = (
  flagsConfig: FlagsConfiguration,
  userConfiguration: UserConfiguration
): UserContextFlagEvaluation => {
  let _userConfiguration: UserConfiguration = userConfiguration;

  const evaluate = (flagKey: string): string | boolean => {
    const flagConfig = flagsConfig.find((f) => f.key === flagKey);
    if (!flagConfig) return false;
    if (flagConfig.status !== "enabled") return false;

    return evaluateFlag(flagConfig, _userConfiguration);
  };

  const evaluateAll = (): FlagDict => {
    const flagDict: FlagDict = {};

    for (const flagConfig of flagsConfig) {
      flagDict[flagConfig.key] =
        flagConfig.status === "enabled"
          ? evaluateFlag(flagConfig, _userConfiguration)
          : false;
    }

    return flagDict;
  };

  const setUserConfiguration = (newUserConfiguration: UserConfiguration) => {
    _userConfiguration = newUserConfiguration;
  };

  return { evaluateAll, evaluate, setUserConfiguration };
};

/**
 * Creates a feature flag evaluation engine.
 *
 * @param flagsConfig - Array of flag configurations with strategies and variants
 * @returns An evaluation machine that can create user contexts for flag evaluation
 *
 * @example
 * ```ts
 * const engine = createFlagEngine(flagsConfig);
 * const userContext = engine.createUserContext({ __id: 'user-123', plan: 'premium' });
 * const isEnabled = userContext.evaluate('my-feature');
 * ```
 */
export const createFlagEngine = (
  flagsConfig: FlagsConfiguration
): EvaluationMachine => {
  return {
    createUserContext: (userConfiguration: UserConfiguration) =>
      createUserContext(flagsConfig, userConfiguration),
  };
};

export type {
  ConditionOperator,
  DateComparisonRule,
  DateString,
  EqualityRule,
  EvaluationMachine,
  ExistenceRule,
  FlagConfiguration,
  FlagDict,
  FlagStatus,
  FlagsConfiguration,
  ModuloRule,
  NumericComparisonRule,
  RegexRule,
  Rule,
  RuleValuePrimitive,
  Segment,
  SegmentRule,
  SemVerRule,
  Strategy,
  StringMatchRule,
  UserConfiguration,
  UserContextFlagEvaluation,
  Variant,
} from "./types";