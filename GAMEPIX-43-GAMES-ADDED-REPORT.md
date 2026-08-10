# ArcadeNexa — GamePix catalog expansion

Added 23 additional GamePix entries to the existing 20-game catalog, for 43 total entries.

New games:
- TenTrix
- 10x10!
- Kobadoo Flags
- My Parking Lot
- Ballistic
- 100 Doors - Escape from Prison
- Prism Match 3D
- Art Puzzle
- Path - Puzzle
- Puzzle Drive
- Screw Puzzle: Nuts & Bolts
- Goods Sort Puzzle
- Puzzlebot
- Slime Adventure
- Platforms
- F1 Racing Game
- Racing Cars Game
- Street Racing
- Goals
- Smash Karts
- Madalin Stunt Cars 2
- Dynamons
- Bomber Friends

Each new entry includes title, description, long description, instructions, categories/tags, rating, dimensions, GamePix official page URL, and a local lightweight SVG cover under public/images/gamepix/.

The game player URLs continue to be generated through the existing buildGamePixUrl() integration; no game files were copied or scraped.

Build note: a local production build could not be executed in this environment because npm install could not retrieve yocto-queue from the configured package registry (HTTP 404). The source changes were made without changing the project's existing build architecture.
