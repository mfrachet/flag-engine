import { murmur3 } from "murmurhash-js";
import { Strategy } from "./types";

const MAX_INT_32 = Math.pow(2, 32);

export const resolveStrategyVariant = (strategy: Strategy, userKey: string) => {
  strategy.variants.sort((a, b) => a.percent - b.percent);

  let cumulative = 0;

  const murmurkey = `${strategy.name}-${userKey}`;
  const hash = murmur3(murmurkey);

  const variant = strategy.variants.find((variant) => {
    const userFlagPercentage = (hash / MAX_INT_32) * 100;

    cumulative += variant.percent;

    if (userFlagPercentage <= cumulative) {
      return variant;
    }

    return undefined;
  });

  if (variant) return variant;
  return false;
};
