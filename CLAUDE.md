# CLAUDE.md – Portfolio-Website Sascha Rossi

Persönliche Bewerbungs-/Portfolio-Website (Solutions Engineer), zweisprachig DE/EN, live unter
https://sascharossi.github.io/rossi-solutions-engineer-website/ (GitHub Pages, Repo `sascharossi/rossi-solutions-engineer-website`).
Sprache mit dem Nutzer: **Deutsch**. Details, Entscheidungen und Fallstricke: `docs/PROJECT-CONTEXT.md` (bei größeren Änderungen lesen).

> Dieses Repo ist **öffentlich**. In Doku, Commits und Code keine privaten Daten, keine internen Kunden-/Systemdetails.

## Befehle
```bash
npm install
npm run dev            # Vite-Dev-Server (Vorschau unter /rossi-solutions-engineer-website/)
npm run build          # Produktions-Build nach dist/
npx oxlint src         # Lint (muss sauber sein)
python3 scripts/optimize-hero.py   # Hero-Foto-Varianten neu erzeugen (Pillow mit WebP+AVIF)
```
Deploy: Push auf `main` → GitHub Actions (`.github/workflows/deploy.yml`) baut und veröffentlicht (~1 Min.).

## Tech-Stack
React 19 + Vite 8, Tailwind CSS 4 (`@tailwindcss/vite`), Framer Motion, oxlint. Schriften lokal über `@fontsource/*`
(Inter, JetBrains Mono, Space Grotesk) – **keine** externen Schriften/CDNs. Keine weiteren Dependencies ohne Rückfrage.

## Struktur
| Pfad | Zweck |
|---|---|
| `src/content.js` | **Alle Texte** (DE+EN in `i18n.de` / `i18n.en`), `links`, `techStack` |
| `src/App.jsx` | Gesamte UI: Navigation, alle Sektionen, Rechtsseiten-Route, Hooks (`useMedia`, `useScrollNav`), Hilfskomponenten (`Reveal`, `Heading`, `Flow`, `Icon`) |
| `src/Particles.jsx` | Canvas-Hintergrund (Netzwerk-Partikel) |
| `src/index.css` | Tailwind + Design-Tokens (`@theme`), `scroll-margin-top` für Anker |
| `index.html` | Meta/Open-Graph, Preload des Hero-Fotos |
| `vite.config.js` | `base: '/rossi-solutions-engineer-website/'` |
| `public/img/` | Hero-Foto-Varianten (AVIF/WebP/JPEG, 448/640/832 px), `public/og-image.png` (Link-Vorschau) |
| `originals/` | Foto-Original (wird nicht ausgeliefert) |
| `scripts/optimize-hero.py` | erzeugt die Foto-Varianten aus dem Original |

## Architektur in Kurzform
- **Single Page**, Sektionen in fester Reihenfolge: Hero → `about` → `work` (Schwerpunkte) → `projects` → `stack` → `experience` → `education` → `contact`.
- **Rechtsseiten** (Impressum, Datenschutz) per **Hash-Route** `#/impressum`, `#/datenschutz` (kein Router); Texte in `content.js` unter `legal`.
- **Sprache:** State `lang` (`de`/`en`), gespeichert in `localStorage`, Startsprache aus `navigator.language`. Alle Sichtbaren Texte kommen aus `i18n[lang]`.
- **Navigation:** Desktop (≥1024 px) Pill mit allen Links; darunter kompakt (`SR. | DE EN | Menü`) nach Scrollen, blendet beim Runterscrollen aus, Menü-Overlay. Anker-Sprünge nutzen `scroll-margin-top` (`section[id]`).
- **Animationen:** `Reveal` (Framer `whileInView`, einmalig), Partikel-Canvas; `prefers-reduced-motion` wird respektiert.

## Design-Konventionen (nicht ändern ohne Auftrag)
- Dunkel: `bg #070d0f`, Karten `surface #0d1719`, Linien `#1a2a2d`, Akzent Türkis `#2dd4bf` / dunkler `#0f766e`, Text gedämpft `#8ba3a6`.
- Typo: Inter (Text), JetBrains Mono (Labels/Tags, `eyebrow`), Space Grotesk (`font-display`: nur Name, Kennzahlen, Kernaussagen).
- Karten: `rounded-2xl border border-line bg-gradient-to-br from-surface to-bg`, Hover `border-accent/60`.
- Chips: zentral = türkise Kontur (`border-accent-deep/70 bg-accent-deep/20`), ergänzend = dezenter Text. Mono-Tags: `font-mono text-xs text-accent border border-accent-deep/60`.
- Abstände: Sektionen `px-5 sm:px-6 py-14 md:py-24` (Konstante `sectionPad`). Mobile-first, Breakpoints `md` 768, `lg` 1024.

## Content-Modell (`content.js`, Struktur muss in DE und EN identisch bleiben)
- `projects.items[]`: `title, scope, problem, solution, points[], tags[]` + optional `principle, metrics[[wert,label]], results[], flow[[[titel,sub]]], role, labels{problem,solution,highlights}, link{label,url}`. Fehlende optionale Felder rendern nichts (Projekte 1–3 haben alle, Projekt 4 nur Text + Link).
- `experience.items[]`: `[datum, rolle, firma, text, tags[]]`; `education.items[]`: `[jahr, titel, zusatz]`; `work.items[]`: `[titel, text, tags[]]` (ungerade letzte Karte läuft ab `md` über beide Spalten).
- `techStack[]` (gemeinsam für beide Sprachen): `{key, core[], extra[]}`; Kategorienamen/`extraLabels`/`rename` pro Sprache unter `i18n.<lang>.stack`.

## Verbindliche Regeln des Nutzers
1. **Keine Inhalte erfinden** (Technologien, Kennzahlen, Erfahrung). Nichts kürzen oder umformulieren, was nicht beauftragt ist; vom Nutzer gelieferte Texte **wörtlich** übernehmen. Wenn DE geändert wird, EN sinngemäß nachziehen und das **ausdrücklich melden**.
2. **Kein CV/Lebenslauf-Download**, keine Telefonnummer, keine private E-Mail. Kontakt nur: E-Mail (`links.email`), LinkedIn, XING.
3. Aktueller Arbeitgeber heißt überall nur **„Reknova GmbH“** – nie „SUMAX“.
4. Projekte 1–3 sind **anonymisiert** (keine Kundennamen, keine Tabellen-/Server-/Pfad-/Bucket-Namen, kein „Patientendaten“). Projekt 4 (eigene DJ-Website) ist nicht anonym.
5. **Kein RAG, kein pgvector** als Erfahrung. „Embeddings“ nur als tatsächlicher Abgleich gegen Korrektur-Einträge (Projekt 1). MCP ist real und darf im Stack stehen (ergänzend).
6. Technologien im Tech Stack **nicht ohne Rückfrage entfernen**; nichts nur wegen Modernität ergänzen.
7. Kein Marketing-Buzzword-Ton („AI Expert“, „Guru“, „Cutting Edge“ …).
8. **Nur ändern, was beauftragt ist** – kein Refactoring, keine Nebenoptimierungen. Bei Layout-Änderungen anderes unberührt lassen.
9. Hero-Foto: nur Skalierung/Neu-Kodierung, **keine** Bearbeitung/Retusche/Nachschärfung.
10. **Kein Force-Push und keine Historien-Umschreibung ohne ausdrückliche Anweisung.** (Die Historie wurde einmal bereinigt, um private Daten zu entfernen – nicht wieder einführen.)

## Arbeitsweise bei Änderungen
1. Neuen **Branch** anlegen (nie direkt auf `main` arbeiten). 2. Ändern, `npm run build` + `npx oxlint src`. 3. Dev-Server starten und prüfen: **375, 768, 1280 px**, **DE und EN**, Anker/Navigation, kein horizontaler Überlauf, keine Konsolenfehler. 4. Dem Nutzer die **genauen Änderungen** zeigen (Dateien, Diff, Screenshots). 5. **Erst nach ausdrücklichem „mergen“** in `main` (Fast-Forward) pushen, Deploy-Lauf abwarten, Live-Seite prüfen (Code/Bilder/Sprachen). 6. Danach Vorschau-Server beenden.

## Fallstricke (Kurzfassung – Details in `docs/PROJECT-CONTEXT.md`)
- Vite ergänzt `base` selbst: im Preload in `index.html` Pfade **ohne** Basispfad (`/img/…`) schreiben.
- Projektkarten haben `key={p.title}` → beim Sprachwechsel werden sie **neu aufgebaut** (alte DOM-Referenzen in Tests werden ungültig).
- `Reveal` blendet erst ein, wenn der Tab **sichtbar** ist: Im Vorschau-Browser Tab in den Vordergrund holen und einmal weg- und zurückscrollen, sonst sind Screenshots leer.
- Impressum/Datenschutz sind rechtlich relevant (Kleinunternehmer § 19 UStG, keine Cookies, lokale Schriften). Neue externe Dienste/Einbettungen → Datenschutztext prüfen/anpassen lassen.
