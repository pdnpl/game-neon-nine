# ADR-0002: Accessible luxury-neon interface

- Status: Accepted
- Date: 2026-08-10

## Context

The game is intentionally simple, so perceived quality depends on typography,
spacing, responsiveness, input feel, and clarity rather than feature count.
The interface must work equally well with touch, mouse, keyboard, assistive
technology, reduced motion, forced colors, and compact landscape viewports.

## Decision

Use a restrained luxury-neon visual system: obsidian and graphite surfaces,
warm ivory text, cyan X marks, and magenta O marks. Build marks and decorative
effects with CSS rather than font glyphs, remote imagery, canvas, or an
animation library. Use the generated `og.png` only for link previews; it is not
loaded by the game interface.

Render each cell as a real button inside a labelled grid. Implement spatial
arrow-key navigation with a single roving tab stop, Enter and Space activation,
descriptive cell labels, a polite live status region, visible focus, and
non-color winning emphasis. Preserve focus after moves and keep occupied cells
navigable while rejecting repeat activation in the state transition.

Limit motion to short transform and opacity transitions. Disable nonessential
motion under `prefers-reduced-motion`, preserve borders and marks in forced
colors, use `100svh` and safe-area insets, and size the board from both width
and height to avoid mobile-browser clipping.

Enforce a production budget of 420 KiB raw client JavaScript, 24 KiB CSS, and
16 KiB game-page JavaScript. Treat the social preview as non-critical media and
cap it separately at 2 MiB so it never hides gameplay bundle growth.

## Consequences

- The same semantic DOM supports pointer, touch, keyboard, and screen readers.
- No continuous effects, remote fonts, or gameplay images compete for CPU,
  bandwidth, or attention.
- X and O remain distinguishable by shape as well as color.
- The design stays legible at 200% zoom and on short landscape screens.
- Decorative glow never substitutes for text, border, or focus contrast.

## Alternatives considered

### Loud arcade styling and particle effects

Rejected because persistent bloom, flashing, and canvas particles reduce
legibility, increase motion sensitivity, and spend performance on decoration.

### Native disabled cells

Rejected because disabled buttons drop out of focus navigation and can strand
keyboard users. Occupied cells instead expose their state and ignore activation.

### Remote display fonts and image-based marks

Rejected to eliminate font-loading shifts, tracking exposure, extra requests,
and unnecessary asset weight.
