import { Bench } from "tinybench";
import { createFlagEngine } from "../index";
import { benchmarkFlags } from "./flagsConfig";

const bench = new Bench({ warmupIterations: 100 });

const engine = createFlagEngine(benchmarkFlags);

// User context that exercises every operator type in the config
const userCtx = engine.createUserContext({
  __id: "bench-user-42",
  plan: "premium",
  country: "FR",
  email: "bench@company.com",
  age: 28,
  status: "active",
  totalOrders: 150,
  lifetimeValue: 1200,
  browser: "Chrome",
  role: "admin",
  accountAgeDays: 400,
  onboardingComplete: true,
  language: "fr",
});

bench.add("evaluateAll (20 flags)", () => {
  userCtx.evaluateAll();
});

await bench.run();
console.table(bench.table());
