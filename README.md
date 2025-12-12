# "Kuyu Games" is a minimalist game app

Being a pwa this project is being developed with next.js.

## To do:

- [ ] feat: forgot password
- [ ] calculate and show tilt angles on mobile?
- [ ] feat: detect aspect ratio and adjust camera rotation according to aspect ratio
- [ ] feat: implement timer for games
- [ ] feat: implement ball sensors
- [ ] feat: add levels
- [ ] feat: add scores
- [ ] feat: implement lock tilt of the table
- [ ] feat: (account) add profile section
- [ ] feat: (game) add settings for audio
- [x] Add "rapier" rust physics library
- [x] Connect "rapier" with three.js
- [x] Create .glb models
- [ ] Auth system, clerk? (Supabase)

## PWA steps

- User visits the PWA
- Show PWA banner / tooltip
- Check Service Worker support
  - If not supported → limited PWA
- Register Service Worker
- Check Push API support
  - If not supported → no push
- Check Notification API support
  - If not supported → cannot show system notifications
- Request notification permission
  - If granted → subscribe user to push
  - If denied → no push
- Listen for `beforeinstallprompt` event
- Show custom "Install PWA" button
  - User installs or dismisses
- User gets full PWA experience (offline, push, notifications, install)

  feat: for adding new PWA functionality (service worker, install prompt, push subscription)
  • fix: for resolving PWA-related bugs (registration failures, permission issues)
  • chore: for configuration, build settings, or cleanup (service worker build config, manifest tweaks)
  • docs: for documenting PWA behavior, installation steps, or architecture diagrams
  • refactor: for reorganizing PWA modules or improving service worker code
  • test: for adding tests for service worker events, notification logic, or UI prompts
  • perf: for optimizing caching strategy or reducing service worker load time
  • style: for formatting updates to PWA files (manifest, sw.js, components)
  • ci: for CI/CD configs related to service-worker building or deployment
