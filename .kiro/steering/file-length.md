# File Length Limits

Keep files focused and short. Long files are a signal that a file is doing too much.

## Hard limits

| File type | Max lines |
|-----------|-----------|
| `.vue` single-file component | 250 |
| `.ts` composable (`use*.ts`) | 200 |
| `.ts` module (non-composable) | 300 |
| `.css` / `<style>` block | 150 |

## What to do when a file exceeds the limit

- **Vue SFC**: If the `<script>` is large, extract logic into a composable. If the `<template>` is large, extract sub-components. If the `<style>` block is large, extract repeated overlay/panel patterns into sub-components that own their own styles.
- **Composable**: Split by concern. Each composable should own one domain concept (e.g. session timing, zone progression, input handling). Compose them together in the parent composable or component.
- **Plain TS module**: Split by responsibility. Prefer named exports from focused files over one large barrel.

## Splitting composables

When a composable exceeds ~200 lines, look for these natural seams:

- **Timer / clock logic** → its own `use<Domain>Timer.ts`
- **Persistence / localStorage** → its own `use<Domain>Storage.ts`
- **Navigation / pagination** → its own `use<Domain>Navigation.ts`
- **A distinct sub-feature** (e.g. zone progression, recall mode) → its own composable

The parent composable imports and composes the smaller ones. It should read like an assembly of concerns, not a monolith.

## Splitting Vue components

When a `.vue` file exceeds ~250 lines, look for self-contained UI regions:

- Modal / overlay dialogs → extract to `<FeatureName>Overlay.vue` or `<FeatureName>Dialog.vue`
- Repeated panel patterns → extract to a named panel component
- A logically distinct section with its own state → extract to a child component

## What NOT to do

- Do not create a file just to move CSS around. Extract a component instead — it takes the markup and styles with it.
- Do not split a composable along technical lines (`state.ts`, `actions.ts`). Split along domain lines.
- Do not create a file with fewer than ~20 meaningful lines just to satisfy the limit. Use judgment.
