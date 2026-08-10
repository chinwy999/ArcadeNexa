# ArcadeNexa — GamePix In-Page Playback Fix

## Changes
- Removed all visible "New Tab" / external fallback controls from the GamePix player and modal.
- GamePix games remain embedded in the ArcadeNexa page.
- Added iframe sandboxing that allows scripts, same-origin, forms, pointer lock and popups while preventing the embedded game from navigating the top-level ArcadeNexa page.
- Added `referrerPolicy="strict-origin-when-cross-origin"`.
- Changed GamePix modal iframe loading to eager.
- Kept GamePix IDs and iframe URLs unchanged.
- Tightened `frame-src` to GamePix hosts.

## Important
The game provider remains externally hosted by GamePix. ArcadeNexa does not download or proxy the game files. The player embeds the official GamePix game inside `/games/<slug>`.

## Verification
The code was checked for remaining `target="_blank"` / `window.open` references in the game player paths. Any external navigation that is intentionally part of unrelated site content is not part of the game player.
