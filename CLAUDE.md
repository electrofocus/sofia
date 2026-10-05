# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Portfolio site for the artist Sofia Seitkhalil, built for a client from their Figma designs. Plain static HTML/CSS with a few small scripts — no build step, package manager, linter, or tests. Preview by serving the root with `python3 -m http.server` rather than opening files directly: YouTube embeds refuse to play from `file://` ("Error 153", no referrer).

Deployed by Cloudflare Pages from `main` on GitHub (no build command, output dir = repo root) at `sofiaseitkhalil.uz`; every push goes live. The domain's Browser Cache TTL is set to "Respect Existing Headers" so CSS/JS are revalidated on each visit — if a CSS change seems not to apply live, check the `cache-control` header with `curl -I` before debugging the code.

## Structure

- `index.html` + `styles.css` — homepage: work list, bio link, contacts, and an absolutely positioned image collage. `styles.css` also holds the reset and color tokens (`--color-lavender`, `--color-green`, `--color-ink`) shared by every page.
- One `.html` per work (plus `bio.html`), each loading both `styles.css` and `works.css`. Each page's `<body>` gets a `<name>-page` class (page background) and `<main class="work <name>">` (the frame). Page-specific rules live in `works.css` under a `/* ---------- Title (W x H) ---------- */` section, using a short BEM prefix (`film__`, `ghosts__`, `loy__`, `jolda__`, `circle__`, `fall__`, `tashkent__`, `blind__`, `mahalla__`, `bio__`).
- `assets/` — images as `.webp` (videos as looping muted `.mp4` with a `.webp` poster), one subfolder per work; shared images (`hand.webp`, collage items, `chevron.svg`) at the top level.
- Film clips are cut from source footage with ffmpeg as `<video autoplay muted loop playsinline poster>`, not GIFs (GIFs of this footage came out ~7× larger): `-an -c:v libx264 -profile:v high -pix_fmt yuv420p -crf 28 -preset slow -movflags +faststart`, scaled to 2× the displayed width. Homebrew's ffmpeg has no WebP encoder, so posters go through a PNG and `cwebp -q 80`. Source footage dropped in the repo root is ignored by `/*.mp4` in `.gitignore`.
- Adding a work means a new HTML page, a new `works.css` section, and a link in `index.html`'s `.info__works` list and in the `works` array in `menu.js`.

## Layout system (the non-obvious part)

Desktop pages are pixel-faithful scaled reproductions of 1512px-wide Figma frames:

- `.work` is `container-type: inline-size` with `aspect-ratio: 1512 / <frame height>`, and every element is absolutely positioned in `cqw` units where **value = Figma px / 15.12** (so 80px → `5.291cqw`). Base text is `0.992cqw` (15px) with `line-height: 2.105`. Keep three-decimal precision when converting new Figma coordinates.
- Exception: **Women of Our Mahalla** is a 27452×982 frame that scrolls sideways — it's sized to the viewport height with `container-type: size`, and offsets are **Figma px / 9.82 in `cqh`**.
- `bio.html` is the only work page whose height grows with its content instead of using a fixed aspect ratio. The homepage `.info` block is also in normal flow so short windows don't crop text.
- The hand (`.work__hand`), the Menu link (`.work__menu`) and the menu panel live outside `<main>` in a `.floating` layer: `position: fixed`, viewport-sized and itself a size container, so they float over the page on scroll while their `cqw`/`cqh` offsets resolve exactly as inside `.work` (they must stay out of `.work`, whose `container-type` can trap fixed children). The Menu link's color is set per page via the `<name>-page` body class.
- Shared building blocks inside `.work`: `.work__text`, `.work__img`, `.work__background`, and `.work__player` — a grey 1351×761 box holding a YouTube `<iframe>` (stretched to fill it by `.work__player iframe`) or, on pages still waiting for a video, a text placeholder.

At `max-width: 880px` (in both stylesheets) the absolute layout is dropped: `.work` becomes a padded flex column at 16px text, and the positioned elements are reset to `position: relative; width: 100%`. Any new absolutely positioned container class must be added to that reset list in `works.css`. Mobile-only tweaks for a page (hiding items, recoloring text, resizing) go in that same media block, not in the page's desktop section.

- To lay out a run of desktop-positioned siblings differently on mobile (e.g. the 3-column `.fall__pages` grid), wrap them in a div that is `display: contents` on desktop — the children keep positioning against `.work` — and give the wrapper `display: grid` in the mobile block.
- `.work` has `overflow: hidden`, so anything dragged past its edge is clipped; the Ghosts pile gets a bottom margin on mobile for that reason.

## Interactive bits

- `menu.js` (loaded by every work page, not the homepage) — builds the `.menu` panel of all works next to `.work__menu` inside `.floating` and toggles it; any click outside the panel or Esc closes it. Without JS the Menu link just goes to `index.html`.
- `drag.js` (loaded by `index.html` and `ghosts.html`) — makes every `.movable` element draggable via pointer events (the grabbed one goes on top); offsets are stored as `translate` percentages of the element's own size so they scale with the page. Used by the homepage collage items (desktop only — the mobile layout turns their pointer events off so they don't fight scrolling) and the `.ghosts__card`s.
- `sometimes-i-fall-apart.html` — prev/next carousel toggling `.is-active` on `.fall__slide`.
- `blind-zone.html` — clicking the work opens a full-screen `<dialog class="viewer">`.
