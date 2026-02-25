export type FlagStatus = "enabled" | "disabled";
export type ConditionOperator =
  | "equals"
  | "not_equals"
  | "contains"
  | "not_contains"
  | "greater_than"
  | "less_than";

type RuleValuePrimitive =
  | object
  | null
  | undefined
  | string
  | number
  | boolean
  | Date;

export type Rule =
  | {
      field: string;
      operator: "equals" | "not_equals" | "contains" | "not_contains";
      value: Array<RuleValuePrimitive>;
    }
  | {
      field: string;
      operator: "greater_than" | "less_than";
      value: number;
    }
  | {
      inSegment: Segment;
    };

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
