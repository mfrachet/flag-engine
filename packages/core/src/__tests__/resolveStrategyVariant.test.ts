import { describe, expect, it } from "vitest";
import { resolveStrategyVariant } from "../resolveStrategyVariant";
import { Strategy } from "../types";

describe("resolveStrategyVariant", () => {
  describe("basic variant resolution", () => {
    it("returns a variant for a single variant at 100%", () => {
      const strategy: Strategy = {
        name: "full-rollout",
        rules: [],
        variants: [{ name: "A", percent: 100 }],
      };

      const result = resolveStrategyVariant(strategy, "user-1");
      expect(result).not.toBe(false);
      if (result !== false) {
        expect(result.name).toBe("A");
      }
    });

    it("always returns the same variant for the same user (determinism)", () => {
      const strategy: Strategy = {
        name: "test-strategy",
        rules: [],
        variants: [
          { name: "A", percent: 50 },
          { name: "B", percent: 50 },
        ],
      };

      const first = resolveStrategyVariant(strategy, "stable-user");
      const second = resolveStrategyVariant(strategy, "stable-user");
      expect(first).toEqual(second);
    });

    it("returns false when no variants are provided (empty array)", () => {
      const strategy: Strategy = {
        name: "empty",
        rules: [],
        variants: [],
      };

      expect(resolveStrategyVariant(strategy, "user-1")).toBe(false);
    });
  });

  describe("variant percentages not summing to 100%", () => {
    it("returns false for some users when percentages sum to less than 100%", () => {
      const strategy: Strategy = {
        name: "partial-rollout",
        rules: [],
        variants: [
          { name: "A", percent: 30 },
          { name: "B", percent: 30 },
        ],
      };

      // With 60% total, ~40% of users should get false
      let falseCount = 0;
      const total = 1000;
      for (let i = 0; i < total; i++) {
        const result = resolveStrategyVariant(strategy, `user-${i}`);
        if (result === false) falseCount++;
      }
      // Expect roughly 40% false (with some tolerance)
      expect(falseCount).toBeGreaterThan(total * 0.3);
      expect(falseCount).toBeLessThan(total * 0.5);
    });

    it("allows percentages summing to more than 100%", () => {
      const strategy: Strategy = {
        name: "over-rollout",
        rules: [],
        variants: [
          { name: "A", percent: 60 },
          { name: "B", percent: 60 },
        ],
      };

      // With 120% total, no user should get false
      let falseCount = 0;
      const total = 1000;
      for (let i = 0; i < total; i++) {
        const result = resolveStrategyVariant(strategy, `user-${i}`);
        if (result === false) falseCount++;
      }
      expect(falseCount).toBe(0);
    });
  });

  describe("edge cases with variant percentages", () => {
    it("returns false for all users when all percentages are 0%", () => {
      const strategy: Strategy = {
        name: "zero-rollout",
        rules: [],
        variants: [
          { name: "A", percent: 0 },
          { name: "B", percent: 0 },
        ],
      };

      for (let i = 0; i < 100; i++) {
        expect(resolveStrategyVariant(strategy, `user-${i}`)).toBe(false);
      }
    });

    it("handles negative percentages", () => {
      const strategy: Strategy = {
        name: "negative",
        rules: [],
        variants: [
          { name: "A", percent: -10 },
          { name: "B", percent: 50 },
        ],
      };

      // Should not throw — behavior is undefined but should not crash
      expect(() => resolveStrategyVariant(strategy, "user-1")).not.toThrow();
    });

    it("handles a variant with 0% alongside others", () => {
      const strategy: Strategy = {
        name: "zero-one",
        rules: [],
        variants: [
          { name: "A", percent: 0 },
          { name: "B", percent: 50 },
          { name: "C", percent: 50 },
        ],
      };

      // Variant A should never be assigned since it has 0%
      let aCount = 0;
      for (let i = 0; i < 1000; i++) {
        const result = resolveStrategyVariant(strategy, `user-${i}`);
        if (result !== false && result.name === "A") aCount++;
      }
      expect(aCount).toBe(0);
    });
  });

  describe("does not mutate input", () => {
    it("does not mutate the strategy variants array", () => {
      const strategy: Strategy = {
        name: "test",
        rules: [],
        variants: [
          { name: "B", percent: 50 },
          { name: "A", percent: 50 },
        ],
      };

      const originalOrder = strategy.variants.map((v) => v.name);
      resolveStrategyVariant(strategy, "user-1");
      const afterOrder = strategy.variants.map((v) => v.name);
      expect(afterOrder).toEqual(originalOrder);
    });
  });
});
