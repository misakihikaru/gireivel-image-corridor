# GIREIVEL MANOR: Shared Direction

Approved by Hikaru in this conversation: the site itself should express Gireivel. The entrance remains the visual reference. Each room retains its own composition; typography, naming, navigation, and the timing of responses belong to the whole manor.

## Working Method

No subagents or delegated tasks anywhere in this project. Work directly in the active session. Read this document in later sessions before extending a room.

## Typography and Language

- English names and architectural labels use Georgia, Times New Roman, serif.
- Japanese prose uses Yu Mincho, Hiragino Mincho ProN, serif. English prose uses Georgia.
- Form controls and technical status use a restrained system sans-serif. Mobile text inputs stay at least 16px.
- Keep page names, room names, signage, person names, and artwork titles in their original English. Translate instructions, descriptions, questions, and errors.
- Explicit data-i18n-ignore marks preserved source text. Never translate testimony, user notes, or published record text by matching words within them.
- Original published records may remain in their source language. Never silently replace a quotation with a machine translation.
- Use whole-message translations for new content. Avoid replacement of arbitrary fragments inside unrelated prose.

## Shared Navigation

JP / EN immediately precedes MANOR MAP in one toolbar. Every room provides access to the same room registry and a return to the manor. The active room is identified. Maps support keyboard focus, Escape, outside click, and focus restoration. Existing room-specific navigation remains available.

## Motion

Motion responds to arrival, attention, and selection. Text remains still while being read. No autoplay, simulated audio visualization, cursor replacement, flashing, or forced scrolling.

- Arrival and newly revealed exhibition sections: a short opacity/vertical reveal, once per element.
- Interactive plates: restrained border and light response on hover, focus, and press.
- Leaving a room: a short fade, with immediate navigation for modified clicks, downloads, same-page links, and reduced motion.
- Pause ambient animation when the document is hidden. Respect changes to prefers-reduced-motion at runtime.
- The original entrance keeps its existing slow breathing image and emblem.

## Room Direction for Later Refinement

| Room | Signature direction |
| --- | --- |
| IMAGE CORRIDOR | Images settle into focus; maintain the original corridor navigation. |
| ECHO RELIQUARY | A single fading line responds to choosing a chamber; no fabricated music synchronization. |
| CONCEPT INCARNATE | Connections and image details respond to selection. |
| OBSERVATION CHAMBER | Existing instrument responds to testimony; retain the local analysis contract. |
| HERESY COLLECTION | The city diagram reflects the actual decision state, not arbitrary movement of places. |
| TRACES | Records appear in reading order; published words remain exact source records. |

These room-specific directions guide later refinements; they are not a claim that every effect is implemented. Shared global changes are implemented and verified in the active session. Record any remaining translation or device-verification gaps in the handoff.

## Current Handoff

The shared toolbar, room registry, signage typography, arrival and exit transitions are implemented. Browser checks cover the eight representative routes at 320, 390, and 1440 pixels in both language modes. These are desktop Edge mobile emulations, not physical iPhone verification.

Heresy Collection now shares the navigation and translated entrance controls. Its deeper branching narrative still needs a dedicated whole-message English translation pass; English mode is not a claim that every narrative passage has been translated. Published records, accompanying notes, and user testimony stay in their source language.
