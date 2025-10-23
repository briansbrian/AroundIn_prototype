<div align="center">

<img width="727" height="485" alt="Aroundin_logo" src="https://github.com/user-attachments/assets/e3e970b4-e9ee-479e-bb3b-58e80985b5e4" />

</div>
# AroundIn


Live demo: <https://aroundin.netlify.app/> 

---

## Overview

AroundIn is a hyperlocal marketplace web application that helps customers discover nearby shops, products, and services. The app offers both customer and vendor experiences — customers can search and browse local listings and vendors can manage their shops and products. The frontend is built with Vite + React and styled with Tailwind (via CDN in index.html).

---

## Dashboard Screenshot

![App Dashboard](<img width="1511" height="858" alt="image" src="https://github.com/user-attachments/assets/4944de28-973d-4454-8308-2b38c4f760ea" />
)

---

## Key Features

- Search local shops, products, and services
- Map-driven discovery and listings
- Customer and vendor modes (switch on the navbar)
- Responsive layout and modern UI components
- Featured shops, category filters, and product highlights
- Fast local builds with Vite

---

## Tech Stack

- Vite (build tooling)
- React (UI)
- React Router (client-side routing)
- Tailwind CSS (utility-first styling via CDN)
- Optional utilities: sharp (image processing scripts)

---

## App Structure (important files & folders)

- index.html — app entry HTML
- index.tsx — client entry (referenced from index.html)
- src/ — React source files and components
- public/
  - image.png — dashboard screenshot (keep here so it’s included in dist)
  - aroundinlogo.png — app logo (keep here so it’s included in dist)
  - _redirects — (optional) SPA redirect file to ensure client-side routes work on Netlify
- vite.config.ts — Vite configuration (reads env like GEMINI_API_KEY)
- package.json — scripts: dev, build, preview, etc.

---


## Contact

Maintainer: briansbrian

If you'd like, replace `<LIVE_URL_HERE>` above with your actual production URL and this README will immediately show the live demo link.
