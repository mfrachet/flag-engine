import { evaluateFlag } from "./evaluateFlag";
import {
  EvaluationMachine,
  FlagDict,
  FlagsConfiguration,
  UserConfiguration,
} from "./types";

const createUserContext = (
  flagsConfig: FlagsConfiguration,
  userConfiguration: UserConfiguration
) => {
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

export const createFlagEngine = (
  flagsConfig: FlagsConfiguration
): EvaluationMachine => {
  return {
    createUserContext: (userConfiguration: UserConfiguration) =>
      createUserContext(flagsConfig, userConfiguration),
  };
};

export type { FlagsConfiguration, UserConfiguration } from "./types";