---
title: 'Angular Signals: Ein praktischer Leitfaden'
slug: angular-signals-practical-guide
date: 2026-03-09
author: Lars Kleen
lang: de
tags: [angular, signals, state-management]
excerpt: 'Signals sind Angulars neue reaktive Primitive — einfacher als RxJS für lokalen State und tief in die Change Detection integriert. Hier ist, wie ich sie in der Praxis nutze.'
---

Angular 17 hat Signals stabilisiert, und nach einer Weile damit zu bauen kann ich sagen, dass sie die tägliche Erfahrung bei der Verwaltung von Component State wirklich verbessern. Dieser Beitrag ist eine praktische Durchgehens der Muster, auf die ich am häufigsten zugreife.

## Was ist ein Signal?

Ein Signal ist ein reaktiver Wert-Container. Das Lesen davon verfolgt eine Abhängigkeit; das Schreiben benachrichtigt Verbraucher.

```typescript
const count = signal(0);

count(); // Lesen — gibt 0 zurück
count.set(1); // Schreiben
count.update((v) => v + 1); // Update basierend auf aktuellem Wert
```

Das ist die gesamte Primitive. Keine Operatoren, keine Subscriptions, kein `| async` in Templates.

## Abgeleiteter State mit `computed()`

`computed()` erstellt ein Signal, dessen Wert von anderen Signals abgeleitet ist. Es ist faul und memoisiert — es wird nur neu ausgeführt, wenn sich eine Abhängigkeit wirklich ändert.

```typescript
const items = signal<string[]>([]);
const count = computed(() => items().length);
const isEmpty = computed(() => count() === 0);
```

Ich verwende `computed()` für alles, das als reine Funktion anderer Signals ausgedrückt werden kann. Es ersetzt die meisten `map` + `distinctUntilChanged` Ketten, die ich früher mit Observables schreiben musste.

## Auf Änderungen mit `effect()` reagieren

Wenn Sie einen Nebeneffekt benötigen — Logging, Synchronisierung mit `localStorage`, Aufrufen einer externen API — verwenden Sie `effect()`.

```typescript
effect(() => {
  localStorage.setItem('theme', theme());
});
```

Der Effect wird neu ausgeführt, wenn sich ein Signal ändert, das er liest. Eine Sache, die zu beachten ist: Effects laufen in einem Injection-Kontext aus, also erstellen Sie sie in einem Constructor oder mit `runInInjectionContext`.

## `input()` und `output()`

Signals erweitern sich natürlich bis zu Component-Grenzen. Die `input()` Funktion ersetzt `@Input()` und gibt direkt ein Signal zurück, damit Sie es in `computed()` ohne Adapter verwenden können.

```typescript
export class PostCardComponent {
  post = input.required<Post>();
  titleUppercase = computed(() => this.post().title.toUpperCase());
}
```

`output()` ersetzt `@Output()` und `EventEmitter`:

```typescript
export class SearchComponent {
  search = output<string>();

  onSubmit(value: string) {
    this.search.emit(value);
  }
}
```

## Wann man RxJS weiterhin verwenden sollte

Signals sind das richtige Werkzeug für lokalen Component State und abgeleitete Werte. RxJS ist immer noch das richtige Werkzeug für:

- HTTP-Anfragen (`HttpClient` gibt Observables zurück)
- Komplexe asynchrone Koordination (`combineLatest`, `switchMap`, Debounce)
- Router- und Platform-Events

Die beiden funktionieren gut zusammen. `toSignal()` konvertiert ein Observable in ein Signal, das ist, wie ich die beiden in Components verbinde.

```typescript
readonly posts$ = inject(BlogService).getPosts();
readonly posts = toSignal(this.posts$, { initialValue: [] });
```

## Fazit

Signals machen den häufigen Fall — Lesen und Schreiben von lokalem State, Ableiten von Werten, Auslösen einfacher Effekte — dramatisch einfacher. Sie ersetzen RxJS nicht; sie machen RxJS leichter zu verwenden, indem sie reduzieren, wie viel davon Sie in Components benötigen.
