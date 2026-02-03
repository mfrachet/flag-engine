import { murmur3 } from "murmurhash-js";
import { Strategy, Variant } from "./types";

const MAX_INT_32 = 2 ** 32;

/**
 * Resolves which variant a user should see based on consistent hashing.
 * Uses MurmurHash3 to generate a deterministic percentage for the user,
 * then maps that to a variant based on cumulative percentages.
 *
 * @param strategy - The strategy containing variants with percentages
 * @param userKey - Unique identifier for the user
 * @returns The resolved variant, or false if no variant matches
 */
export const resolveStrategyVariant = (
  strategy: Strategy,
  userKey: string
): Variant | false => {
  // Sort a copy to avoid mutating the input
  const sortedVariants = [...strategy.variants].sort(
    (a, b) => a.percent - b.percent
  );

  const murmurkey = `${strategy.name}-${userKey}`;
  const hash = murmur3(murmurkey);
  const userFlagPercentage = (hash / MAX_INT_32) * 100;

  let cumulative = 0;

  for (const variant of sortedVariants) {
    cumulative += variant.percent;
    if (userFlagPercentage < cumulative) {
      return variant;
    }
  }

  return false;
};
