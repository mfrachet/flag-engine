export type FlagStatus = "enabled" | "disabled";

/** ISO 8601 date string (e.g., "2025-01-15T00:00:00Z") */
export type DateString = string;

export type ConditionOperator =
  | "equals"
  | "not_equals"
  | "contains"
  | "not_contains"
  | "starts_with"
  | "ends_with"
  | "regex"
  | "greater_than"
  | "less_than"
  | "greater_than_or_equal"
  | "less_than_or_equal"
  | "date_before"
  | "date_after"
  | "is_set"
  | "is_not_set"
  | "modulo"
  | "semver_equal"
  | "semver_greater_than"
  | "semver_less_than";

export type RuleValuePrimitive =
  | object
  | null
  | undefined
  | string
  | number
  | boolean
  | Date;

export type EqualityRule = {
  field: string;
  operator: "equals" | "not_equals";
  value: Array<RuleValuePrimitive>;
};

export type StringMatchRule = {
  field: string;
  operator: "contains" | "not_contains" | "starts_with" | "ends_with";
  value: Array<string>;
};

export type RegexRule = {
  field: string;
  operator: "regex";
  value: string;
};

export type NumericComparisonRule = {
  field: string;
  operator: "greater_than" | "less_than" | "greater_than_or_equal" | "less_than_or_equal";
  value: number;
};

export type DateComparisonRule = {
  field: string;
  operator: "date_before" | "date_after";
  value: DateString;
};

export type ExistenceRule = {
  field: string;
  operator: "is_set" | "is_not_set";
};

export type ModuloRule = {
  field: string;
  operator: "modulo";
  value: { divisor: number; remainder: number };
};

export type SemVerRule = {
  field: string;
  operator: "semver_equal" | "semver_greater_than" | "semver_less_than";
  value: string;
};

export type SegmentRule = {
  inSegment: Segment;
};

export type Rule =
  | EqualityRule
  | StringMatchRule
  | RegexRule
  | NumericComparisonRule
  | DateComparisonRule
  | ExistenceRule
  | ModuloRule
  | SemVerRule
  | SegmentRule;

export type Segment = {
  name: string;
  rules: Array<Rule>;
};

export type Strategy = {
  name: string;
  rules: Array<Rule>;
  variants: Array<Variant>;
};

export type Variant = {
  name: string;
  percent: number;
};

export type FlagConfiguration = {
  key: string;
  status: FlagStatus;
  strategies: Array<Strategy>;
};

export type UserConfiguration = {
  __id: string;
  [key: string]: RuleValuePrimitive;
};

export type FlagsConfiguration = Array<FlagConfiguration>;

export type FlagDict = Record<string, string | boolean>;

export interface UserContextFlagEvaluation {
  evaluateAll: () => FlagDict;
  evaluate: (flagKey: string) => string | boolean;
  setUserConfiguration: (newUserConfiguration: UserConfiguration) => void;
}

export interface EvaluationMachine {
  createUserContext: (
    userConfiguration: UserConfiguration
  ) => UserContextFlagEvaluation;
}
