---
name: effector
description: This rule provides standards for frontend state-management framework.
---

# Overview

Effector is a comprehensive state management library designed to facilitate efficient and predictable state management in JavaScript applications. Consider the Effector LLM-focused guide for scopes, effects, SSR, and testing patterns: [Effector LLM guide](https://effector.dev/docs/llms-full.txt)

Here are a few principles that **Effector** follows:

- Application stores should be as light as possible - the idea of adding a store for specific needs should not be frightening or damaging to the developer;
- Application stores should be freely combined - data that the application needs can be statically distributed, showing how it will be converted in runtime;
- Autonomy from controversial concepts - no decorators, no need to use classes or proxies - this is not required to control the state of the application and therefore the api library uses only functions and plain JS objects.

## Immer

Application `internal state` is based on immutable data structures. Immutable data structures allow for (efficient) change detection: if the reference to an object didn't change, the object itself did not change. In addition, it makes cloning relatively cheap: unchanged parts of a data tree don't need to be copied and are shared in memory with older versions of the same state.

Use [Immer](https://immerjs.github.io/immer/) to work with immutable state in a more convenient way. Here is an overview how to update objects and collections with immer: [Update Patterns](https://immerjs.github.io/immer/update-patterns/).
