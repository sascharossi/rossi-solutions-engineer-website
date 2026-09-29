# Sascha Rossi – Solutions Engineer

Persönliche Website (DE/EN) mit React, Vite, Tailwind CSS und Framer Motion.

- Texte beider Sprachen: `src/content.js`
- Lokal starten: `npm install && npm run dev`
- Deploy: automatisch per GitHub Actions nach GitHub Pages (Branch `main`)

## Hero-Foto
Das Original liegt unter `originals/sascha-original.webp` (wird nicht ausgeliefert). Die Website-Varianten
(AVIF, WebP, JPEG in 448/640/832 px) entstehen mit `python3 scripts/optimize-hero.py` und liegen in `public/img/`.
Nur Skalierung und Neu-Kodierung, keine Bearbeitung.

Live: https://sascharossi.github.io/rossi-solutions-engineer-website/
