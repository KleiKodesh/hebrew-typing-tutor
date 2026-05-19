# No Memory Leaks

Every resource acquired must be explicitly released. No exceptions.

## Rules

### Timers
- Always store `setTimeout` and `setInterval` return values in a variable.
- Always clear them in `onUnmounted` (Vue) or the equivalent cleanup.
- Never attach timers to function objects (e.g. `fn._timer = setTimeout(...)`). Use a local `let` variable instead.

### Event listeners
- Every `addEventListener` must have a corresponding `removeEventListener`.
- For module-level listeners (singletons), use `import.meta.hot.dispose` to clean up on HMR.
- For component-level listeners, remove them in `onUnmounted`.

### Vue composables
- Watchers created inside composables are auto-cleaned when the component unmounts — no action needed.
- Intervals and DOM listeners created inside composables are NOT auto-cleaned — always pair them with `onUnmounted`.

### Refs and DOM
- Null out element refs (`ref.value = null`) in `onUnmounted` if the ref is held by a long-lived closure.

## Pattern to follow

```ts
// ✅ correct
let timer: ReturnType<typeof setTimeout> | null = null

function trigger() {
  if (timer) clearTimeout(timer)
  timer = setTimeout(() => { timer = null }, 300)
}

onUnmounted(() => {
  if (timer) clearTimeout(timer)
})
```

```ts
// ❌ wrong — timer stored on function, never cleaned up
function trigger() {
  clearTimeout((trigger as any)._timer)
  ;(trigger as any)._timer = setTimeout(() => {}, 300)
}
```
