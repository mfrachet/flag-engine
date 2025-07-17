<div align="center">⛵ A feature flags evaluation engine, runtime agnostic with no remote services.
<br/>
<br/>

Demo [NextJs](https://codesandbox.io/p/devbox/7tjw9s) | [React Native (Snack)](https://snack.expo.dev/@mfrachet/flag-engine-example) | [Client Side](https://stackblitz.com/edit/vitejs-vite-a8kiur?file=main.js) | [Server Side](https://stackblitz.com/edit/stackblitz-starters-jfhzjq?file=index.js)

</div>
<br/>

![20 pixelized boats on the sea](https://github.com/user-attachments/assets/5628ad4c-6e77-4f5c-9e81-2bc5f14b5d51)

---

## What is Flag Engine?

Flag Engine is a runtime agnostic and source agnostic feature flags evaluation engine. You give it a configuration and a context, and it will evaluate the flags for you.

**What Flag Engine is not:**

- A feature flag management platform
- A feature flag dashboard
- An analytics platform, you have to send your events to your analytics platform
- A way to store your feature flags
- A drop-in replacement for [OpenFeature](https://openfeature.dev). (a provider for Flag Engine will be created to be compliant with the OpenFeature API)

## Usage

1. Install the package:

```bash
$ pnpm add @flag-engine/core
```

2. Create a configuration (or build it from where it makes sense for you like a DB or a static file, or whatever)

```typescript
import {
  createFlagEngine,
  FlagsConfiguration,
  UserConfiguration,
} from "@flag-engine/core";

const flagsConfig: FlagsConfiguration = [
  {
    key: "feature-flag-key",
    status: "enabled", // the status of the flag, can be "enabled" or "disabled"
    strategies: [], // a set of condition for customization purpose
  },
];

// This is useful to create conditions based on the user's attributes.
// The __id is mandatory and a special one that will be used to compute % based variants.
const userConfiguration: UserConfiguration = {
  __id: "73a56693-0f83-4ffc-a61d-7c95fdf68693", // a unique identifier for the user or an empty string if the users are not connected.
};

const engine = createFlagEngine(flagsConfig);
const userCtx = engine.createUserContext(userConfiguration);

// Evaluate one specific feature flag
const isFlagEnabled = userCtx.evaluate("feature-flag-key"); // true

// Evaluate all the feature flags at once
const allFlags = userCtx.evaluateAll(); // { "feature-flag-key": true }
```

## Concepts

### Flag configuration

It's a descriptive object that contains guidance on how the feature flag should be evaluated. It's composed of a list of feature flags with their **status** (`enabled` or `disabled`) and a list of **strategies**.

### User configuration

This is an object that holds details about the current user. It includes a unique identifier (`__id`, which is mandatory) and other custom attributes (defined by you) that can be used to evaluate feature flags. These attributes can be utilized within strategies to specify the conditions necessary to determine a computed feature flag variant.

This is useful if you want your QA team to test the feature behind the flag: you can create a strategy that targets users with your domain address (e.g., `@gmail.com`), ensuring that only they will see the flag enabled.

> Another example: the current user has a `country` attribute with a value of `France`. I have defined a strategy with a condition on the `country` attribute with a value of `France`. This user is eligible to resolve a computed variant. If the user sends a `US` country, they will resolve a `false` variant.

**Notes**:

- the `__id` is mandatory and should be your user uniquer id OR an empty string if the users are not connected.

### Flag status

- `enabled`: The feature flag is enabled. (returns true or the computed variant)
- `disabled`: The feature flag is disabled. (returns false every time)

### Strategies

**Strategies** is where all the customization stands. In a strategy, you can define:

- **a set of rules** that are needed to be eligible for the feature flag evaluation (using the user configuration/context)
- a list of variants with the percentage of the population that should see each variant. Those are computed against the `__id` of the user (this is why it's mandatory).

**It's important to understand that:**

- Each **strategy** is an `or`. It means that if the user matches **at least one strategy**, they will be eligible for the feature flag evaluation.

- Each **rule** is an `and`. It means that **all the rules in one strategy must be true** for the user for the strategy to be eligible.

This is convenient for combining **and** and **or** logic and create complex conditional feature flags.

## An exhaustive example

I want to show my audience **2 variants** of a feature. Only the people living in `France` and `Spain` should see the feature.

Here is how I can do that:

```typescript
const flagsConfig: FlagsConfiguration = [
  {
    key: "feature-flag-key",
    status: "enabled", // the status of the flag, can be "enabled" or "disabled"
    strategies: [
      {
        name: "only-france-and-spain",
        rules: [
          {
            field: "country",
            operator: "in",
            value: ["France", "Spain"],
          },
        ],
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
];

const engine = createFlagEngine(flagsConfig);
const userCtx = engine.createUserContext({
  __id: "b",
  country: "France",
});

const variant = userCtx.evaluate("feature-flag-key"); // gives back B
```

Now, I suggest you give it a try, build your config object the way you prefer and start building stuff!

❤️❤️❤️

---

Built by [@mfrachet](https://twitter.com/mfrachet)
