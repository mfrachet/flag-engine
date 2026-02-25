import { FlagsConfiguration } from "../types";

/**
 * 20 realistic flag configurations exercising every operator type,
 * segments, multiple strategies, and variant resolution.
 */
export const benchmarkFlags: FlagsConfiguration = [
  // 1 — equals + variants
  {
    key: "homepage-redesign",
    status: "enabled",
    strategies: [
      {
        name: "beta-users",
        rules: [
          { field: "plan", operator: "equals", value: ["premium", "enterprise"] },
          { field: "country", operator: "equals", value: ["FR", "US", "DE"] },
        ],
        variants: [
          { name: "Control", percent: 50 },
          { name: "Redesign", percent: 50 },
        ],
      },
      {
        name: "fallback",
        rules: [
          { field: "country", operator: "equals", value: ["GB"] },
        ],
        variants: [
          { name: "Control", percent: 80 },
          { name: "Redesign", percent: 20 },
        ],
      },
    ],
  },

  // 2 — not_equals + contains
  {
    key: "dark-mode",
    status: "enabled",
    strategies: [
      {
        name: "exclude-free",
        rules: [
          { field: "plan", operator: "not_equals", value: ["free"] },
          { field: "email", operator: "contains", value: ["@company.com"] },
        ],
        variants: [
          { name: "DarkOn", percent: 70 },
          { name: "DarkOff", percent: 30 },
        ],
      },
    ],
  },

  // 3 — greater_than + less_than
  {
    key: "age-gated-feature",
    status: "enabled",
    strategies: [
      {
        name: "adults-only",
        rules: [
          { field: "age", operator: "greater_than", value: 17 },
          { field: "age", operator: "less_than", value: 100 },
        ],
        variants: [],
      },
    ],
  },

  // 4 — inSegment
  {
    key: "internal-tools",
    status: "enabled",
    strategies: [
      {
        name: "internal-segment",
        rules: [
          {
            inSegment: {
              name: "internal-users",
              rules: [
                { field: "email", operator: "contains", value: ["@internal.io", "@dev.io"] },
              ],
            },
          },
        ],
        variants: [
          { name: "V1", percent: 50 },
          { name: "V2", percent: 50 },
        ],
      },
    ],
  },

  // 5 — not_contains + equals
  {
    key: "competitor-block",
    status: "enabled",
    strategies: [
      {
        name: "non-competitors",
        rules: [
          { field: "email", operator: "not_contains", value: ["@rival.com", "@enemy.com"] },
          { field: "status", operator: "equals", value: ["active"] },
        ],
        variants: [],
      },
    ],
  },

  // 6 — three strategies, mixed rules
  {
    key: "checkout-flow",
    status: "enabled",
    strategies: [
      {
        name: "vip",
        rules: [
          { field: "plan", operator: "equals", value: ["enterprise"] },
          { field: "totalOrders", operator: "greater_than", value: 100 },
        ],
        variants: [
          { name: "FastCheckout", percent: 100 },
        ],
      },
      {
        name: "premium",
        rules: [
          { field: "plan", operator: "equals", value: ["premium"] },
        ],
        variants: [
          { name: "FastCheckout", percent: 60 },
          { name: "StandardCheckout", percent: 40 },
        ],
      },
      {
        name: "everyone-else",
        rules: [
          { field: "plan", operator: "not_equals", value: ["banned"] },
        ],
        variants: [
          { name: "StandardCheckout", percent: 100 },
        ],
      },
    ],
  },

  // 7 — disabled flag (should short-circuit)
  {
    key: "deprecated-feature",
    status: "disabled",
    strategies: [
      {
        name: "legacy",
        rules: [
          { field: "country", operator: "equals", value: ["US"] },
        ],
        variants: [{ name: "Legacy", percent: 100 }],
      },
    ],
  },

  // 8 — contains with multiple values
  {
    key: "email-domain-feature",
    status: "enabled",
    strategies: [
      {
        name: "allowed-domains",
        rules: [
          { field: "email", operator: "contains", value: ["@alpha.com", "@beta.com", "@gamma.com"] },
        ],
        variants: [
          { name: "A", percent: 33 },
          { name: "B", percent: 33 },
          { name: "C", percent: 34 },
        ],
      },
    ],
  },

  // 9 — segment + field rule in same strategy
  {
    key: "premium-geo-feature",
    status: "enabled",
    strategies: [
      {
        name: "premium-in-eu",
        rules: [
          {
            inSegment: {
              name: "eu-users",
              rules: [
                { field: "country", operator: "equals", value: ["FR", "DE", "IT", "ES", "NL", "BE"] },
              ],
            },
          },
          { field: "plan", operator: "equals", value: ["premium", "enterprise"] },
        ],
        variants: [
          { name: "EuExperience", percent: 80 },
          { name: "Default", percent: 20 },
        ],
      },
    ],
  },

  // 10 — no strategies (always true)
  {
    key: "global-banner",
    status: "enabled",
    strategies: [],
  },

  // 11 — greater_than only
  {
    key: "high-value-users",
    status: "enabled",
    strategies: [
      {
        name: "big-spenders",
        rules: [
          { field: "lifetimeValue", operator: "greater_than", value: 1000 },
        ],
        variants: [
          { name: "GoldTier", percent: 50 },
          { name: "SilverTier", percent: 50 },
        ],
      },
      {
        name: "medium-spenders",
        rules: [
          { field: "lifetimeValue", operator: "greater_than", value: 200 },
        ],
        variants: [
          { name: "SilverTier", percent: 100 },
        ],
      },
    ],
  },

  // 12 — not_equals with variants
  {
    key: "new-search",
    status: "enabled",
    strategies: [
      {
        name: "not-legacy",
        rules: [
          { field: "browser", operator: "not_equals", value: ["IE", "Edge-Legacy"] },
          { field: "country", operator: "not_equals", value: ["CN"] },
        ],
        variants: [
          { name: "NewSearch", percent: 90 },
          { name: "OldSearch", percent: 10 },
        ],
      },
    ],
  },

  // 13 — nested segment (2 levels)
  {
    key: "nested-segment-feature",
    status: "enabled",
    strategies: [
      {
        name: "nested",
        rules: [
          {
            inSegment: {
              name: "outer-segment",
              rules: [
                {
                  inSegment: {
                    name: "inner-segment",
                    rules: [
                      { field: "role", operator: "equals", value: ["admin", "superadmin"] },
                    ],
                  },
                },
                { field: "country", operator: "equals", value: ["US", "FR"] },
              ],
            },
          },
        ],
        variants: [
          { name: "AdminView", percent: 100 },
        ],
      },
    ],
  },

  // 14 — less_than with multiple strategies
  {
    key: "junior-onboarding",
    status: "enabled",
    strategies: [
      {
        name: "new-users",
        rules: [
          { field: "accountAgeDays", operator: "less_than", value: 30 },
          { field: "onboardingComplete", operator: "equals", value: [false] },
        ],
        variants: [
          { name: "GuidedTour", percent: 70 },
          { name: "QuickStart", percent: 30 },
        ],
      },
      {
        name: "recent-users",
        rules: [
          { field: "accountAgeDays", operator: "less_than", value: 90 },
        ],
        variants: [
          { name: "QuickStart", percent: 100 },
        ],
      },
    ],
  },

  // 15 — contains + not_contains combined
  {
    key: "email-campaign",
    status: "enabled",
    strategies: [
      {
        name: "target-audience",
        rules: [
          { field: "email", operator: "contains", value: ["@gmail.com", "@yahoo.com"] },
          { field: "email", operator: "not_contains", value: ["+spam", "+junk"] },
        ],
        variants: [
          { name: "CampaignA", percent: 50 },
          { name: "CampaignB", percent: 50 },
        ],
      },
    ],
  },

  // 16 — three variants, two strategies
  {
    key: "pricing-experiment",
    status: "enabled",
    strategies: [
      {
        name: "us-pricing",
        rules: [
          { field: "country", operator: "equals", value: ["US"] },
          { field: "plan", operator: "not_equals", value: ["free"] },
        ],
        variants: [
          { name: "PriceA", percent: 33 },
          { name: "PriceB", percent: 33 },
          { name: "PriceC", percent: 34 },
        ],
      },
      {
        name: "eu-pricing",
        rules: [
          { field: "country", operator: "equals", value: ["FR", "DE", "ES"] },
        ],
        variants: [
          { name: "EuPriceA", percent: 50 },
          { name: "EuPriceB", percent: 50 },
        ],
      },
    ],
  },

  // 17 — four rules in one strategy
  {
    key: "power-user-dashboard",
    status: "enabled",
    strategies: [
      {
        name: "power-users",
        rules: [
          { field: "role", operator: "equals", value: ["admin", "superadmin", "manager"] },
          { field: "accountAgeDays", operator: "greater_than", value: 365 },
          { field: "lifetimeValue", operator: "greater_than", value: 500 },
          { field: "plan", operator: "not_equals", value: ["free", "trial"] },
        ],
        variants: [
          { name: "PowerDashboard", percent: 100 },
        ],
      },
    ],
  },

  // 18 — segment + contains + greater_than
  {
    key: "loyalty-program",
    status: "enabled",
    strategies: [
      {
        name: "loyal-premium",
        rules: [
          {
            inSegment: {
              name: "premium-segment",
              rules: [
                { field: "plan", operator: "equals", value: ["premium", "enterprise"] },
              ],
            },
          },
          { field: "totalOrders", operator: "greater_than", value: 50 },
          { field: "email", operator: "not_contains", value: ["@test.com"] },
        ],
        variants: [
          { name: "GoldReward", percent: 40 },
          { name: "SilverReward", percent: 40 },
          { name: "BronzeReward", percent: 20 },
        ],
      },
    ],
  },

  // 19 — disabled flag with complex strategies
  {
    key: "upcoming-feature",
    status: "disabled",
    strategies: [
      {
        name: "alpha",
        rules: [
          { field: "role", operator: "equals", value: ["alpha-tester"] },
          { field: "country", operator: "equals", value: ["US"] },
        ],
        variants: [
          { name: "Alpha", percent: 100 },
        ],
      },
      {
        name: "beta",
        rules: [
          { field: "role", operator: "equals", value: ["beta-tester"] },
        ],
        variants: [
          { name: "Beta", percent: 100 },
        ],
      },
    ],
  },

  // 20 — wide equals + three strategies
  {
    key: "regional-content",
    status: "enabled",
    strategies: [
      {
        name: "north-america",
        rules: [
          { field: "country", operator: "equals", value: ["US", "CA", "MX"] },
          { field: "language", operator: "equals", value: ["en", "es"] },
        ],
        variants: [
          { name: "NaContent", percent: 100 },
        ],
      },
      {
        name: "europe",
        rules: [
          { field: "country", operator: "equals", value: ["FR", "DE", "IT", "ES", "NL", "BE", "PT"] },
          { field: "language", operator: "equals", value: ["fr", "de", "it", "es", "nl", "pt"] },
        ],
        variants: [
          { name: "EuContent", percent: 100 },
        ],
      },
      {
        name: "rest-of-world",
        rules: [
          { field: "language", operator: "equals", value: ["en"] },
        ],
        variants: [
          { name: "GlobalContent", percent: 100 },
        ],
      },
    ],
  },
];
