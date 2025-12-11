# "Kuyu Games" is a minimalist game app

Being a pwa this project is being developed with next.js.

## To do:

- [ ] feature: forgot password
- [ ] calculate and show tilt angles on mobile?
- [ ] game-core: detect aspect ratio and adjust camera rotation according to aspect ratio
- [ ]
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
