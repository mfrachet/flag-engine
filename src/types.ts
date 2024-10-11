export type FlagStatus = "enabled" | "disabled";
export type ConditionOperator =
  | "equals"
  | "not_equals"
  | "contains"
  | "not_contains"
  | "greater_than"
  | "less_than";

export type Rule =
  | {
      field: string;
      operator: ConditionOperator;
      value: string | number | boolean;
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
  [key: string]: string | number | boolean;
};

export type FlagsConfiguration = Array<FlagConfiguration>;

export type FlagDict = Record<string, string | boolean>;

export interface EvaluationMachine {
  evaluateAll: () => FlagDict;
  evaluate: (flagKey: string) => string | boolean;
  setUserConfiguration: (newUserConfiguration: UserConfiguration) => void;
}
