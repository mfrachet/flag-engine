import { evaluateFlag } from "./evaluateFlag";
import {
  EvaluationMachine,
  FlagDict,
  FlagEngineOptions,
  FlagsConfiguration,
  UserConfiguration,
} from "./types";
import { getHighResTime } from "./utils";

const createUserContext = (
  flagsConfig: FlagsConfiguration,
  userConfiguration: UserConfiguration,
  options?: FlagEngineOptions
) => {
  let _userConfiguration: UserConfiguration = userConfiguration;

  const evaluate = (flagKey: string) => {
    const flagConfig = flagsConfig.find((f) => f.key === flagKey);
    if (!flagConfig) return false;
    if (flagConfig.status === "disabled") return false;

    const startTime = getHighResTime();
    const result = evaluateFlag(flagConfig, _userConfiguration);
    const endTime = getHighResTime();

    if (options?.onFlagEvaluated) {
      options.onFlagEvaluated({
        flagKey,
        evaluationResult: result,
        startTime,
        endTime,
        duration: endTime - startTime,
      });
    }
    return result;
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
  flagsConfig: FlagsConfiguration,
  options?: FlagEngineOptions
): EvaluationMachine => {
  return {
    createUserContext: (userConfiguration: UserConfiguration) =>
      createUserContext(flagsConfig, userConfiguration, options),
  };
};

export type { FlagsConfiguration, UserConfiguration } from "./types";
