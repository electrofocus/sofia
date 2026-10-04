# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Portfolio site for the artist Sofia Seitkhalil, built for a client from their Figma designs. Plain static HTML/CSS with a few inline `<script>` blocks — no build step, package manager, linter, or tests. Open the `.html` files directly in a browser, or serve the root with any static server (e.g. `python3 -m http.server`) to preview.

## Structure

- `index.html` + `styles.css` — homepage: work list, bio link, contacts, and an absolutely positioned image collage. `styles.css` also holds the reset and color tokens (`--color-lavender`, `--color-green`, `--color-ink`) shared by every page.
- One `.html` per work (plus `bio.html`), each loading both `styles.css` and `works.css`. Each page's `<body>` gets a `<name>-page` class (page background) and `<main class="work <name>">` (the frame). Page-specific rules live in `works.css` under a `/* ---------- Title (W x H) ---------- */` section, using a short BEM prefix (`film__`, `ghosts__`, `loy__`, `jolda__`, `circle__`, `fall__`, `tashkent__`, `blind__`, `mahalla__`, `bio__`).
- `assets/` — images as `.webp` (videos as looping muted `.mp4` with a `.webp` poster), one subfolder per work; shared images (`hand.webp`, collage items, `chevron.svg`) at the top level.
- Adding a work means a new HTML page, a new `works.css` section, and a link in `index.html`'s `.info__works` list and in the `works` array in `menu.js`.

## Layout system (the non-obvious part)

Desktop pages are pixel-faithful scaled reproductions of 1512px-wide Figma frames:

- `.work` is `container-type: inline-size` with `aspect-ratio: 1512 / <frame height>`, and every element is absolutely positioned in `cqw` units where **value = Figma px / 15.12** (so 80px → `5.291cqw`). Base text is `0.992cqw` (15px) with `line-height: 2.105`. Keep three-decimal precision when converting new Figma coordinates.
- Exception: **Women of Our Mahalla** is a 27452×982 frame that scrolls sideways — it's sized to the viewport height with `container-type: size`, and offsets are **Figma px / 9.82 in `cqh`**.
- `bio.html` is the only work page whose height grows with its content instead of using a fixed aspect ratio. The homepage `.info` block is also in normal flow so short windows don't crop text.
- The hand (`.work__hand`), the Menu link (`.work__menu`) and the menu panel live outside `<main>` in a `.floating` layer: `position: fixed`, viewport-sized and itself a size container, so they float over the page on scroll while their `cqw`/`cqh` offsets resolve exactly as inside `.work` (they must stay out of `.work`, whose `container-type` can trap fixed children). The Menu link's color is set per page via the `<name>-page` body class.
- Shared building blocks inside `.work`: `.work__text`, `.work__img`, `.work__background`, and `.work__player` (grey 1351×761 placeholder box where a video embed will go).

At `max-width: 880px` (in both stylesheets) the absolute layout is dropped: `.work` becomes a padded flex column at 16px text, and the positioned elements are reset to `position: relative; width: 100%`. Any new absolutely positioned container class must be added to that reset list in `works.css`.

## Interactive bits

- `menu.js` (loaded by every work page, not the homepage) — builds the `.menu` panel of all works next to `.work__menu` inside `.floating` and toggles it; any click outside the panel or Esc closes it. Without JS the Menu link just goes to `index.html`.
- `ghosts.html` — each `.ghosts__card` is draggable via pointer events; offsets are stored as `translate` percentages of the card's own size so they scale with the page.
- `sometimes-i-fall-apart.html` — prev/next carousel toggling `.is-active` on `.fall__slide`.
- `blind-zone.html` — clicking the work opens a full-screen `<dialog class="viewer">`.
