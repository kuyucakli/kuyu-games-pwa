# "Kuyu Games" is a minimalist game app

Being a pwa this project is being developed with next.js.

## To do:

- [ ] feature: forgot password
- [ ] Calculate and show tilt angles on mobile?
- [x] Add "rapier" rust physics library
- [x] Connect "rapier" with three.js
- [x] Create .glb models
- [ ] Auth system, clerk? (Supabase)

        ┌─────────────────────────┐
        │  User visits the PWA    │
        └────────────┬────────────┘
                     │
                     ▼
       ┌─────────────────────────┐
       │ Show PWA banner / tooltip│
       └────────────┬────────────┘
                     │
                     ▼
       ┌─────────────────────────┐
       │ Check Service Worker    │
       └───────┬─────────────────┘
               │
        ┌──────┴───────┐
        │ Not supported│
        │ → limited PWA│
        └──────┬───────┘
               │
               ▼
       ┌─────────────────────────┐
       │ Register Service Worker │
       └────────────┬────────────┘
                     │
                     ▼
       ┌─────────────────────────┐
       │ Check Push API support  │
       └───────┬─────────────────┘
               │
        ┌──────┴───────┐
        │ Not supported│
        │ → cannot     │
        │ receive push │
        └──────┬───────┘
               │
               ▼
       ┌─────────────────────────┐
       │ Check Notification API  │
       └───────┬─────────────────┘
               │
        ┌──────┴───────┐
        │ Not supported│
        │ → cannot     │
        │ show system  │
        │ notifications│
        └──────┬───────┘
               │
               ▼
       ┌─────────────────────────┐
       │ Request Notification    │
       │ Permission              │
       └───────┬─────────────────┘
        ┌──────┴────────┐
        │ Granted       │
        │ → Subscribe   │
        │ user to push  │
        └──────┬────────┘
               │
        ┌──────┴────────┐
        │ Denied        │
        │ → no push     │
        └──────┬────────┘
               │
               ▼
       ┌─────────────────────────┐
       │ Listen for beforeinstall│
       │ prompt event            │
       └───────┬─────────────────┘
               │
               ▼
       ┌─────────────────────────┐
       │ Show custom Install     │
       │ PWA button              │
       └───────┬─────────────────┘
        ┌──────┴────────┐
        │ User clicks   │
        │ → Installed / │
        │ Dismissed     │
        └──────┬────────┘
               │
               ▼
       ┌─────────────────────────┐
       │ Full PWA experience:    │
       │ offline, push,          │
       │ notifications, install  │
       └─────────────────────────┘
