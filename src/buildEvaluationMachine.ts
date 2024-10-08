import { evaluateFlag } from "./evaluateFlag";
import { FlagDict, FlagsConfiguration, UserConfiguration } from "./types";

export const buildEvaluationMachine = (
  flagsConfig: FlagsConfiguration,
  userConfiguration: UserConfiguration
) => {
  let _userConfiguration: UserConfiguration = userConfiguration;

  const evaluateAll = () => {
    const flagDict: FlagDict = {};

    for (const flagConfig of flagsConfig) {
      flagDict[flagConfig.key] = evaluateFlag(flagConfig, _userConfiguration);
    }

    return flagDict;
  };

  const evaluate = (flagKey: string) => {
    const flagConfig = flagsConfig.find((f) => f.key === flagKey);
    if (!flagConfig) return false;
    return evaluateFlag(flagConfig, _userConfiguration);
  };

  const setUserConfiguration = (newUserConfiguration: UserConfiguration) => {
    _userConfiguration = newUserConfiguration;
  };

  return { evaluateAll, evaluate, setUserConfiguration };
};
