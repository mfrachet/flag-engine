import { evaluateFlag } from "./evaluateFlag";
import {
  EvaluationMachine,
  FlagDict,
  FlagsConfiguration,
  UserConfiguration,
} from "./types";

export const buildEvaluationMachine = (
  flagsConfig: FlagsConfiguration,
  userConfiguration: UserConfiguration
): EvaluationMachine => {
  let _userConfiguration: UserConfiguration = userConfiguration;

  const evaluate = (flagKey: string) => {
    const flagConfig = flagsConfig.find((f) => f.key === flagKey);
    if (!flagConfig) return false;
    if (flagConfig.status === "disabled") return false;

    return evaluateFlag(flagConfig, _userConfiguration);
  };

  const evaluateAll = () => {
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
