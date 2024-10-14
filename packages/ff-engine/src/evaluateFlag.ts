import { getEligibleStrategy } from "./getEligibleStrategy";
import { resolveStrategyVariant } from "./resolveStrategyVariant";
import { FlagConfiguration, UserConfiguration } from "./types";

export const evaluateFlag = (
  flagConfig: FlagConfiguration,
  userConfiguration: UserConfiguration
) => {
  if (flagConfig.strategies.length === 0) return true;

  const eligibleStrategy = getEligibleStrategy(flagConfig, userConfiguration);
  if (!eligibleStrategy) return false;
  if (eligibleStrategy.variants.length === 0) return true;

  const variant = resolveStrategyVariant(
    eligibleStrategy,
    userConfiguration.__id
  );

  if (variant) return variant.name;

  return false;
};
