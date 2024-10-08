import { murmur3 } from "murmurhash-js";
import { Strategy, Variant } from "./types";

const MAX_INT_32 = Math.pow(2, 32);

const isMatchingVariant = (variant: Variant, userKey: string) => {
  const evaluationKey = `${variant.name}-${userKey}`;
  const hash = murmur3(evaluationKey);
  const userFlagPercentage = (hash / MAX_INT_32) * 100;

  if (userFlagPercentage <= variant.percent) {
    return variant;
  }

  return undefined;
};

export const resolveStrategyVariant = (strategy: Strategy, userKey: string) => {
  strategy.variants.sort((a, b) => a.percent - b.percent);

  const variant = strategy.variants.find((variant) =>
    isMatchingVariant(variant, userKey)
  );

  if (variant) return variant;
  return false;
};
