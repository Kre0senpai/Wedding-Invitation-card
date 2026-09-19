# Arjun &amp; Priya — Wedding Invitation Website

A single-page wedding invitation site, styled after the Rajasthani/royal
reference video you shared: golden arch hero, ceremony &amp; reception details,
photo gallery, countdown, calendar, map, dress code, day schedule, guestbook,
and a gift-box QR modal — with background music.

## How to open it

No build step needed. Just open `index.html` in a browser.

Two things only work when served over `http://` (not `file://`) and with an
internet connection, because browsers block them on local files:
- The Google Maps embed in the **Venue** section
- Loading the Google Fonts used for the headings/script text

The easiest way to preview correctly:
```bash
cd wedding-invite
python3 -m http.server 8000
# then open http://localhost:8000 in your browser
```
Or just upload the whole folder to any static host (see "Deploying" below).

## Folder structure

```
wedding-invite/
├── index.html              All page content/sections
├── css/style.css            All styling
├── js/script.js             Countdown, calendar, carousel, modals, guestbook
├── assets/
│   ├── images/
│   │   ├── hero-arch.png        Hero background (lake + palace + flowers)
│   │   ├── hero-arch-2.png      Transparent gold arch + Ganesh + bells overlay
│   │   ├── wedding-paper-bg.png Parchment background used on every section
│   │   ├── hero-flowers.png     Spare floral corner asset (not placed yet)
│   │   ├── hero-phone.png       Spare sunset-arch asset (not placed yet)
│   │   ├── side-tower.png       Spare cut-out tower asset (not placed yet)
│   │   ├── flower.png           Spare single dahlia asset (not placed yet)
│   │   ├── gift-box.png         Gift Box section image
│   │   ├── groom-qr.png         QR code shown in the Gift Box modal
│   │   ├── bride-qr.png         QR code shown in the Gift Box modal
│   │   └── gallery/
│   │       ├── gallery-1.jpg … gallery-8.jpg   PLACEHOLDER photos
│   └── audio/
│       └── wedding-music.mp3    Background music (loops, muted until tapped)
└── README.md
```

## Things you'll want to replace

1. **Gallery photos** — `assets/images/gallery/gallery-1.jpg` through
   `gallery-8.jpg` are placeholder cards ("Add your photo here"). Drop in
   real photos with the **same filenames** (or edit the list in
   `js/script.js` → `galleryImages`) — portrait orientation, roughly a
   4:5 ratio, works best in the coverflow.
2. **Names, parents, addresses, dates, times** — all in `index.html`,
   inside the `#ceremony` and `#reception` sections. It's plain text/HTML,
   search for "Arjun", "Priya", "Rajiv Mehta" etc.
3. **Event date/time** — open `js/script.js` and edit the `CONFIG` object
   at the top:
   ```js
   eventDateTime: "2026-12-05T19:00:00",   // drives the countdown
   eventEnd: "2026-12-05T21:30:00",        // drives the .ics download
   calendarYear: 2026,
   calendarMonth: 12,
   calendarHighlightDay: 5
   ```
4. **Venue** — update the address text in the `#venue` section and the
   Google Maps `src` URL (swap the query after `q=`) and the "Get
   directions" link.
5. **Bank / QR details** — in the Gift Box modal markup near the bottom of
   `index.html`, update the bank names and account numbers, and replace
   `assets/images/groom-qr.png` / `bride-qr.png` with your real QR images
   (same filenames, or update the `src`/`href` attributes).
6. **Background music** — replace `assets/audio/wedding-music.mp3` with
   your track, same filename, or update the `<source>` path in
   `index.html`.

## How the interactive bits work

- **Music**: starts automatically after the visitor taps "Open Invitation"
  (browsers block autoplay with sound before a user gesture). A floating
  note button in the bottom-right toggles play/pause anytime.
- **Countdown**: recalculated every second in `js/script.js`, driven by
  `CONFIG.eventDateTime`.
- **Calendar**: generated from `CONFIG.calendarYear` / `calendarMonth`, so
  it will always draw the correct weekday layout if you change the year.
- **Add to Calendar**: builds a `.ics` file in the browser and downloads it
  — no server required, works in Apple/Google/Outlook calendars.
- **Photo gallery**: a lightweight coverflow carousel written in vanilla
  JS (no library) — click an image or use the arrows.
- **Guestbook**: messages are saved in the visitor's own browser
  (`localStorage`), pre-seeded with 5 example wishes. This is
  **per-device only** — it does *not* collect wishes centrally across all
  visitors. For a real shared guestbook you'll need a small backend or a
  service like Firebase/Supabase/Formspree.
- **RSVP form**: currently just shows a thank-you message and stores the
  response in `localStorage` on that visitor's device. To actually
  receive RSVPs, connect the form in `index.html` (`#rsvpForm`) to a
  service such as [Formspree](https://formspree.io),
  [Google Forms](https://forms.google.com), or your own endpoint.
- **Gift Box**: tapping the gift image opens a modal with both QR codes
  and "Save QR" download buttons (downloads the PNG directly).

## Deploying it for real

Any static host works since there's no backend:
- **Netlify / Vercel**: drag-and-drop the `wedding-invite` folder.
- **GitHub Pages**: push the folder to a repo, enable Pages.
- **Any shared hosting**: upload the folder via FTP.

## Notes on fidelity to the reference video

- The transparent gold-arch overlay (`hero-arch-2.png`) needed its
  background cleaned up (the file you gave me had its transparency baked
  in as a visible checkerboard) — I keyed it out so it composites
  correctly. If you get a proper transparent export later, just replace
  the file with the same name.
- The decorative gold corner flourishes and dividers (seen framing
  "CEREMONY INFO", the section dividers, etc.) weren't provided as
  separate image assets, so they're recreated with CSS/inline styling to
  match the look.
- `hero-flowers.png`, `hero-phone.png`, `side-tower.png` and `flower.png`
  are included in the assets folder but not placed on the page yet — they
  were part of your upload but didn't have an obvious 1:1 spot in the
  reference video. Happy to weave them into a section (e.g. as extra
  floral accents) if you point me at where you'd like them.
