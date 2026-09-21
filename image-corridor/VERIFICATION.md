# Image Corridor: Distance Pass

Local verification completed on 2026-09-21. Publication was subsequently authorized by Hikaru.

## Release Scope

The release includes this room and corridor-scoped dependencies in `manor.css` and `manor.js`. Other rooms' pending presentation changes and the untracked automation files are excluded. A temporary detached checkout is used to validate the exact release without replacing the user's working files. The existing shared map and language controls remain the sole controls. Live deployment verification is reported separately after the push.

## Scope

- Only `image-corridor/index.html`, `archive.html`, `styles.css`, `script.js`, and the room's validation files were edited in this pass.
- Retained the previously adjusted entrance, all nine image paths and their order, observation text, tags, Zero Layer text, and Exit text. Source comparison against HEAD passed.
- Existing shared presentation changes elsewhere in the worktree were retained. No shared navigation, language control, runtime dependency, or artwork was added or replaced.

## Presentation and Interaction

- Desktop panels occupy one viewport each, retaining the alternating image/caption composition and scroll-driven horizontal corridor.
- Images remain uncropped and undimmed. A short opacity reveal runs once on first encounter; captions remain still.
- Mobile, short landscape windows, and reduced-motion mode use a vertical sequence. Runtime mode changes retain the current observation.
- Expanded images use a centered, contained image with a caption below. Short landscape windows put the caption alongside the image.
- Keyboard focus aligns an offscreen desktop work with the viewport. The dialog contains Tab/Shift+Tab, supports Escape, and restores focus without changing the reading position.
- Zero Layer and Exit have quieter text sizing and reading space. The return message covers the viewport with black and fades out.
- Observation labels and room headings stay in English. Archive tags now use individual text nodes supported by the existing translation dictionary.

## Checks

- Playwright with installed desktop Edge: 320, 390, 768, 1024, and 1440 CSS pixels, JP and EN.
- All nine sequential works and all nine archive images decode; contained rendering, observation numbering, translations, and horizontal overflow checked.
- Entry, desktop wheel scrolling, image open/close, Tab/Shift+Tab, Escape, focus restoration, re-observation, fullscreen return message, and shared map verified.
- Runtime reduced-motion switching in both directions, absence of animations in reduced-motion mode, and 1024 x 540 layout verified.
- Archive return and Manor return links followed in the local browser.
- Existing shared browser suite passed on both corridor routes at all five widths and both languages.
- Existing Node suites: 21 passed. JavaScript syntax and `git diff --check` passed.
- Screenshots inspected for mobile/desktop exhibition, expanded image, Zero Layer, Exit, return message, and archive.

Browser evidence: `%TEMP%/gireivel-corridor-s9lcpz/`.
Shared browser evidence: `%TEMP%/gireivel-manor-qa-c0hOsW/`.
Additional motion/navigation evidence: `%TEMP%/gireivel-corridor-tvxOcD/`.

## Reproduce

Set `NODE_PATH` to the bundled Node packages containing Playwright, then run:

```powershell
node image-corridor/tests/browser.cjs
```

`--motion-only` runs runtime motion changes, short-window inspection, and return navigation. `--archive-only` checks the archive across all five widths and both languages.

For existing JSDOM suites, set `GIREIVEL_TEST_DEPS` to the validation `node_modules` directory containing `jsdom`:

```powershell
node --test tests/manor.test.cjs heresy-collection/tests/*.test.mjs records/tests/*.test.mjs
$env:GIREIVEL_QA_PAGES = '/image-corridor/,/image-corridor/archive.html'
node tests/manor-browser.cjs
```

## Limits

These are desktop Edge viewport emulations, not physical-phone or Safari checks. External analytics were blocked in the room-specific browser suite. No live deployment was performed or verified.
