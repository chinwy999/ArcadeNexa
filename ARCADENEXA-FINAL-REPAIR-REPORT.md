# ArcadeNexa Final Repair Report

## Applied repairs

- Unified the production site URL to `https://bespoke-daffodil-e35130.netlify.app`.
- Removed the stale Netlify domain from site URL fallback, metadata, sitemap, robots, Open Graph, JSON-LD and GamePix referrer generation.
- Tightened `postMessage` origin validation and rejected untrusted messages before processing.
- Added validation for score/coins message payloads.
- Changed the main game iframe to eager loading on the dedicated game page so the player starts without unnecessary lazy-loading delay.
- Removed fabricated aggregate ratings from VideoGame structured data.
- Removed fabricated publication dates from game structured data.
- Corrected Open Graph image metadata to use the actual large thumbnail when available instead of claiming a fixed 1200×675 size.
- Restricted Next Image remote hosts to `img.gamepix.com`.
- Tightened the public CSP image/connect/script allowances to the GamePix domains used by the project.
- Replaced the old ArcadeNexa branding in public-facing pages with ArcadeNexa.
- Removed fabricated player/tournament/prize statistics from the About and Tournaments pages.
- Replaced the fake tournament listings with a transparent "Coming soon" state.
- Updated `.env.example` with the current Netlify URL.

## Game integration

The existing GamePix game catalog and official thumbnail URLs were preserved. No game files were downloaded into the deployment.

## Deployment

Set this Netlify environment variable:

`NEXT_PUBLIC_SITE_URL=https://bespoke-daffodil-e35130.netlify.app`

If a custom domain is connected later, change only this variable to the final HTTPS domain.

## Build verification

A production build could not be executed in this isolated environment because the package registry returned a 404 while installing `yocto-queue@0.1.0`. This is an external package-registry limitation, not a reported source-code build error. Run `npm install` and `npm run build` in Netlify or a normal Node/npm environment before publishing this ZIP.
