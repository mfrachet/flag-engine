import { getEligibleStrategy } from "./getEligibleStrategy";
import { resolveStrategyVariant } from "./resolveStrategyVariant";
import { FlagConfiguration, UserConfiguration } from "./types";

/**
 * Evaluates a feature flag for a given user configuration.
 *
 * @param flagConfig - The flag configuration to evaluate
 * @param userConfiguration - The user context containing __id and custom fields
 * @returns true if flag is enabled with no variants, variant name if matched, false otherwise
 */
export const evaluateFlag = (
  flagConfig: FlagConfiguration,
  userConfiguration: UserConfiguration
): string | boolean => {
  if (flagConfig.strategies.length === 0) return true;

  const eligibleStrategy = getEligibleStrategy(flagConfig, userConfiguration);
  if (!eligibleStrategy) return false;
  if (eligibleStrategy.variants.length === 0) return true;

  const variant = resolveStrategyVariant(
    eligibleStrategy,
    userConfiguration.__id
  );

  if (variant !== false) {
    return variant.name;
  }

  return false;
};
