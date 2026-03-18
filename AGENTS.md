# IAN Agent Rules

## Scope

These rules apply to the whole repository unless a deeper `AGENTS.md` overrides them.

## Communication

- Default to Simplified Chinese for user-facing summaries unless the task explicitly asks for another language.
- Keep replies concise, practical, and execution-oriented.
- When assumptions are necessary, make the smallest safe assumption and state it briefly.

## Project Intent

- This site exists to serve dreamcore, surreal, liminal, and glitch-installation aesthetics.
- Visual atmosphere is a primary product goal, not decoration.
- Do not simplify the experience into a generic clean UI unless the task explicitly asks for that.
- Preserve the low-performance fallback path while evolving the high-immersion path.

## Product Guardrails

- Keep GitHub Pages compatibility intact.
- Preserve `VITE_BASE_PATH` and `VITE_ROUTER_MODE` support.
- Preserve low-performance adaptation through `PerformanceContext` and related helpers.
- Prefer existing abstractions such as `AdaptiveMedia`, `routeModules`, and the performance helpers before adding new patterns.
- Do not add heavyweight media without a static fallback, low-performance behavior, or both.
- Avoid removing surreal text, motion, or layered atmospherics unless they directly break usability or performance goals.

## Validation

Run these checks after meaningful code changes:

```bash
npm run build
npm run lint
```

Useful local commands:

```bash
npm run dev
npm run preview -- --host 0.0.0.0 --port 4173
```

## Files To Understand First

- `src/App.tsx`
- `src/index.css`
- `src/data/scenes.ts`
- `src/components/AdaptiveMedia.tsx`
- `src/context/PerformanceContext.tsx`
- `src/lib/performance.ts`

## Review Guidelines

- Flag regressions that break GitHub Pages subpath deployment.
- Flag changes that bypass low-performance fallbacks on weak devices.
- Flag asset additions that increase cost without a clear visual payoff.
- Flag broken media references, dead routes, and localization drift.
- Treat build or lint regressions as release blockers.

## Task Bias

- For feature work, prioritize immersive output with controlled performance.
- For optimization work, reduce transfer, decode, or runtime cost before reducing artistic intent.
- For review work, focus on bugs, regressions, deployment risk, and missing validation first.
