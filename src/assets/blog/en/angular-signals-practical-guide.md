---
title: 'Angular Signals: A Practical Guide'
slug: angular-signals-practical-guide
date: 2026-03-09
author: Lars Kleen
lang: en
tags: [angular, signals, state-management]
excerpt: "Signals are Angular's new reactive primitive — simpler than RxJS for local state, and deeply integrated with change detection. Here is how I use them in practice."
---

Angular 17 made signals stable, and after building with them for a while I can say they genuinely improve the day-to-day experience of managing component state. This post is a practical walkthrough of the patterns I reach for most often.

## What is a signal?

A signal is a reactive value container. Reading it tracks a dependency; writing to it notifies consumers.

```typescript
const count = signal(0);

count(); // read — returns 0
count.set(1); // write
count.update((v) => v + 1); // update based on current value
```

That's the whole primitive. No operators, no subscriptions, no `| async` in templates.

## Derived state with `computed()`

`computed()` creates a signal whose value is derived from other signals. It's lazy and memoised — it only re-runs when a dependency actually changes.

```typescript
const items = signal<string[]>([]);
const count = computed(() => items().length);
const isEmpty = computed(() => count() === 0);
```

I use `computed()` for anything that can be expressed as a pure function of other signals. It replaces most of the `map` + `distinctUntilChanged` chains I used to write with observables.

## Reacting to changes with `effect()`

When you need a side effect — logging, syncing to `localStorage`, calling an external API — use `effect()`.

```typescript
effect(() => {
  localStorage.setItem('theme', theme());
});
```

The effect re-runs whenever any signal it reads changes. One thing to keep in mind: effects run in an injection context, so create them in a constructor or with `runInInjectionContext`.

## `input()` and `output()`

Signals extend naturally to component boundaries. The `input()` function replaces `@Input()` and returns a signal directly, so you can use it in `computed()` without any adapters.

```typescript
export class PostCardComponent {
  post = input.required<Post>();
  titleUppercase = computed(() => this.post().title.toUpperCase());
}
```

`output()` replaces `@Output()` and `EventEmitter`:

```typescript
export class SearchComponent {
  search = output<string>();

  onSubmit(value: string) {
    this.search.emit(value);
  }
}
```

## When to keep using RxJS

Signals are the right tool for local component state and derived values. RxJS is still the right tool for:

- HTTP requests (`HttpClient` returns observables)
- Complex async coordination (`combineLatest`, `switchMap`, debounce)
- Router and platform events

The two work well together. `toSignal()` converts an observable to a signal, which is how I bridge the two in components.

```typescript
readonly posts$ = inject(BlogService).getPosts();
readonly posts = toSignal(this.posts$, { initialValue: [] });
```

## Takeaway

Signals make the common case — reading and writing local state, deriving values, triggering simple effects — dramatically simpler. They don't replace RxJS; they make RxJS easier to use by reducing how much of it you need inside components.
