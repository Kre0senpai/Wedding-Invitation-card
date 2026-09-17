# Arjun & Priya — Wedding Invitation

A single-page wedding invitation site (Vite + React + Framer Motion),
built to match the reference template layout.

## Run it

```bash
npm install
npm run dev
```

Then open the printed local URL (usually http://localhost:5173).

## Build for hosting

```bash
npm run build
```

This produces a `dist/` folder you can upload anywhere (Netlify, Vercel,
GitHub Pages, etc.).

## Sections included

1. Welcome hero (names, Ganesha emblem, palace silhouette)
2. Ceremony Info (both families, couple's names, ceremony date/time)
3. Photo Gallery (3D coverflow carousel — currently placeholder cards)
4. Reception Info (live countdown to the wedding)
5. Calendar (December 2026, 5th highlighted) + live Google Maps embed
   for Rambagh Palace, Jaipur + "Add to Calendar" (.ics download) +
   "Confirm Attendance" button
6. Dress Code swatches + Wedding Day Schedule timeline
7. Guestbook (pre-seeded wishes + a working form to add new ones —
   messages are stored in memory only, so they reset on page reload)
8. Gift Box (tap-to-open reveal)
9. Footer

## Customizing

Everything editable — names, family details, dates, venue, schedule,
dress code colors, and gallery captions — lives at the top of
`src/main.jsx` in one block of constants (`COUPLE`, `FAMILIES`,
`CEREMONY`, `RECEPTION`, `DRESS_CODE`, `SCHEDULE`, etc.).

### Adding real photos

Drop your images into `public/images/` and replace the
`GALLERY_PLACEHOLDERS` array in `src/main.jsx` with your own photo
paths (e.g. `/images/photo-1.jpg`), swapping the placeholder colored
cards for `<img>` tags in the `PhotoGallerySection` component.

### Making the guestbook permanent

Right now wishes are only kept in the browser's memory for the current
session. To persist them across visits/visitors you'd need a small
backend or a service like Firebase — let me know if you'd like that
wired up.
