import { describe, expect, it } from "vitest";
import { createFlagEngine } from "..";

describe("repartition", () => {
  it("should be distributive", () => {
    const engine = createFlagEngine([
      {
        key: "summer-sale",
        status: "enabled",
        strategies: [
          {
            name: "All audience",
            rules: [],
            variants: [
              {
                name: "A",
                percent: 50,
              },
              {
                name: "B",
                percent: 50,
              },
            ],
          },
        ],
      },
    ]);
    const COUNT = 1000_000;
    let A = 0;
    let B = 0;

    for (let i = 0; i < COUNT; i++) {
      const userCtx = engine.createUserContext({ __id: `user-${i}` });
      const variant = userCtx.evaluate("summer-sale");
      if (variant === "A") {
        A++;
      } else if (variant === "B") {
        B++;
      }
    }

    const halfCount = COUNT / 2;
    const halfCountUpper = halfCount * 1.001;
    const halfCountLower = halfCount * 0.999;

    expect(A).toBeGreaterThan(halfCountLower);
    expect(A).toBeLessThan(halfCountUpper);
    expect(B).toBeGreaterThan(halfCountLower);
    expect(B).toBeLessThan(halfCountUpper);
  });

  it("should be distributive", () => {
    const engine = createFlagEngine([
      {
        key: "summer-sale",
        status: "enabled",
        strategies: [
          {
            name: "All audience",
            rules: [],
            variants: [
              {
                name: "A",
                percent: 50,
              },
              {
                name: "B",
                percent: 50,
              },
            ],
          },
        ],
      },
    ]);
    const COUNT = 10_000_000;
    let A = 0;
    let B = 0;

    for (let i = 0; i < COUNT; i++) {
      const userCtx = engine.createUserContext({ __id: `user-${i}` });
      const variant = userCtx.evaluate("summer-sale");
      if (variant === "A") {
        A++;
      } else if (variant === "B") {
        B++;
      }
    }

    const halfCount = COUNT / 2;
    const halfCountUpper = halfCount * 1.0003;
    const halfCountLower = halfCount * 0.9997;

    expect(A).toBeGreaterThan(halfCountLower);
    expect(A).toBeLessThan(halfCountUpper);
    expect(B).toBeGreaterThan(halfCountLower);
    expect(B).toBeLessThan(halfCountUpper);
  });

  it("should be distributive", () => {
    const engine = createFlagEngine([
      {
        key: "summer-sale",
        status: "enabled",
        strategies: [
          {
            name: "All audience",
            rules: [],
            variants: [
              {
                name: "A",
                percent: 10,
              },
              {
                name: "B",
                percent: 20,
              },
              {
                name: "C",
                percent: 30,
              },
              {
                name: "D",
                percent: 40,
              },
            ],
          },
        ],
      },
    ]);

    const COUNT = 1000_000;
    let A = 0;
    let B = 0;
    let C = 0;
    let D = 0;

    for (let i = 0; i < COUNT; i++) {
      const userCtx = engine.createUserContext({ __id: `user-${i}` });
      const variant = userCtx.evaluate("summer-sale");
      if (variant === "A") {
        A++;
      } else if (variant === "B") {
        B++;
      } else if (variant === "C") {
        C++;
      } else if (variant === "D") {
        D++;
      }
    }

    const upperABound = COUNT * 0.101;
    const lowerABound = COUNT * 0.099;

    expect(A).toBeGreaterThan(lowerABound);
    expect(A).toBeLessThan(upperABound);

    const upperBBound = COUNT * 0.201;
    const lowerBBound = COUNT * 0.199;

    expect(B).toBeGreaterThan(lowerBBound);
    expect(B).toBeLessThan(upperBBound);

    const upperCBound = COUNT * 0.301;
    const lowerCBound = COUNT * 0.299;

    expect(C).toBeGreaterThan(lowerCBound);
    expect(C).toBeLessThan(upperCBound);

    const upperDBound = COUNT * 0.401;
    const lowerDBound = COUNT * 0.399;

    expect(D).toBeGreaterThan(lowerDBound);
    expect(D).toBeLessThan(upperDBound);
  });
});
