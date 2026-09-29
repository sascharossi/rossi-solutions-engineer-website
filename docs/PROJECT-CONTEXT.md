# PROJECT-CONTEXT – Portfolio-Website Sascha Rossi

Ergänzung zu `CLAUDE.md` (dort: Befehle, Struktur, Regeln). Hier: Hintergründe, Entscheidungen, Rezepte und Fallstricke aus der bisherigen Arbeit.
Repo ist **öffentlich** – nichts Privates oder Internes hier ergänzen.

## 1. Ziel und Positionierung
- Bewerbungs- und Portfolioseite für **Solutions Engineer** (AI Automation · Web Development · Data Engineering; Zusatz: API & System Integration, Cloud/Self-Hosted).
- Bewusst **ausführlich und technisch**, keine Kurz-Landingpage. Wirkung über konkrete Projekte mit Ergebnissen und Datenfluss-Diagrammen.
- Kernclaim im Hero: „Web. Automation. Data. AI.“ Ansprache in **Du-Form**. Hero/Kontakt sprechen sowohl Festanstellung als auch Projekte an („Lass uns über die passende Zusammenarbeit sprechen.“).
- Vorlage war ein dunkles Portfolio (Three.js-Look); übernommen wurde nur die Struktur. Bewusst **kein** greller Cyan und **kein** Blob im Hero; ruhiges Türkis + Partikelnetz.

## 2. Getroffene Entscheidungen (mit Begründung)
| Entscheidung | Grund |
|---|---|
| Hosting GitHub Pages, öffentliches Repo | kostenlos; Pages benötigt bei Free-Plan ein öffentliches Repo |
| Vite + React statt Static HTML | wiederverwendbare Komponenten, i18n-State, Animationen |
| Alle Texte in `content.js` (DE/EN) | Sprachumschalter, einfache Pflege, Parität der Sprachen |
| Hash-Routing für Rechtsseiten | GitHub Pages hat kein SPA-Fallback; kein Router nötig |
| Schriften lokal (`@fontsource`) | Google Fonts von Google-Servern ist datenschutzrechtlich problematisch (IP-Übertragung) |
| Keine Cookies/Tracking | kein Banner nötig; Datenschutztext bleibt kurz |
| Foto als AVIF/WebP/JPEG mit `srcset` | Handy lädt ~13 KB statt ~70 KB; LCP nicht verschlechtert (`fetchpriority=high`, Preload, kein Lazy Loading, feste Breite/Höhe → CLS 0) |
| Kein CV-Download | Nutzer sendet den Lebenslauf nur im direkten Bewerbungsprozess |
| Kein X/Twitter-Link, sondern **XING** | so vom Nutzer gewünscht/vorhanden |
| „Leistungen“-Sektion entfernt, „Schwerpunkte“ vor „Projekte“ | Leistungen und Schwerpunkte waren fast identisch |
| Ausbildung als eigene Sektion (nicht im „Über mich“) | volle Breite der Qualifikationen sichtbar (Kombination Logistik/Einkauf/IT ist Teil des Profils) |
| Tech Stack als 6 Karten (zentral = Kontur-Chips, ergänzend = dezenter Text) | „Pill-Wand“ wirkte wie Keyword-Sammlung |
| Projekte 1–3 anonymisiert, Projekt 4 (eigene DJ-Website) mit Live-Link | Kundenschutz; Projekt 4 belegt Web Development mit eigenem Produkt |

## 3. Inhalte und Aufbau der Sektionen
- **Hero:** Name (Space Grotesk, Verlauf), Rolle, Bereiche, Text, Claim, zwei Buttons; Foto rechts (Desktop) bzw. **unter dem Namen** (mobil) – realisiert über ein Grid mit `md:col-start/row-start`.
- **Über mich:** drei Absätze, Karte „Was ich verbinde“ (7 Bereiche), Karte „Vor der IT-Laufbahn“ (7 Stationen), Kernaussage „Technisches Know-how trifft auf langjährige operative Erfahrung.“
- **Schwerpunkte:** 5 Karten; fünfte Karte über volle Breite (Textbreite `md:max-w-2xl`, Tags rechts).
- **Projekte:** 4 Karten. 1 Kommentar-Moderation (Prinzip „Regeln zuerst, LLM nur wo nötig“, Flow mit Validierungsstufe), 2 Buchungs-Workflow (Datenminimierung), 3 Kontakt-Synchronisierung, 4 DJ-Website (kompakt, ohne Kennzahlen/Flow, mit Button „Website ansehen ↗“ → `https://www.delarossi.de/`, `target=_blank rel=noopener noreferrer`). Überschriften pro Projekt überschreibbar (`labels`), Rolle überschreibbar (`role`).
- **Tech Stack:** 6 Karten (AI & LLM, Automation & Integration, Data Engineering, Development & Web, Cloud & Infrastructure, Analytics & Platforms). Karte 6 hat Zwischenüberschrift „Weitere Plattformen“ (nur Text, keine Chips). Englisch: `rename: { Datenmodellierung: 'Data Modelling' }`.
- **Erfahrung:** Timeline (Reknova GmbH → MVZ-Station → Praktikum) mit Technologie-Tags, darunter Karte „Frühere Erfahrung“.
- **Ausbildung:** 7 Einträge, absteigend (2025 … 2006). Alle behalten, nicht auf den FIAE-Abschluss reduzieren.
- **Kontakt:** E-Mail, LinkedIn, XING. Footer: Impressum, Datenschutz.
- `Über mich` erwähnt bewusst frühere Berufserfahrung (Teamleitung, Einkauf, Logistik, Außendienst, Eventbranche) – gehört zum Profil.

## 4. Wiederkehrende Komponenten / Muster (alle in `App.jsx`)
- `Reveal({ delay, className })` – Einblendung beim Scrollen (einmalig). Wrapper von Grid-Items (Klasse z. B. `md:col-span-2` wird hier übergeben).
- `Heading({ label, title })` – Mono-Label + H2. `eyebrow`-Konstante für kleine Mono-Überschriften.
- `Flow({ stages })` – Datenfluss-Diagramm: Stufen von links nach rechts ab `lg`, darunter senkrecht (max. Breite begrenzt); Stufen mit mehreren Knoten werden mobil 2-spaltig.
- `Icon` – Inline-SVGs (LinkedIn, XING, Mail).
- `useMedia(query)`, `useScrollNav()` – Navigation: `scrolled` (>80 px), `hidden` (nach unten scrollen), nur unter `lg` aktiv.
- Karten-Muster: siehe `CLAUDE.md` (Design-Konventionen). Neue Karten daran orientieren, aber nicht 1:1 kopieren.

## 5. Neue Inhalte hinzufügen (Vorgehen)
- **Neues Projekt:** Objekt in `projects.items` von `de` **und** `en` (gleiche Reihenfolge). Nummer (`0{idx+1}`) ergibt sich automatisch. Nur Felder setzen, die vorhanden sind. Vorher die tatsächlichen Technologien im Projektcode belegen (Tags nur aus Code, nicht aus dem allgemeinen Stack ableiten).
- **Neue Sektion:** Eintrag in `sections`-Array, Labels in `i18n.<lang>.nav`, Section-JSX mit `id`, `className={sectionPad}`, `Heading`, `Reveal`. `scroll-margin-top` greift automatisch über `section[id]`. Nav-Breite ab 1024 px prüfen (7 Einträge passen knapp).
- **Neue Technologie im Stack:** in `techStack` unter `core` oder `extra` einer Kategorie; Sprachvarianten nur bei Bedarf über `stack.rename`.
- **Neue Seite (z. B. weitere Rechtsseite):** in `readRoute()` und `legal`-Content ergänzen, Footer-Link, DE+EN.

## 6. Hero-Foto-Pipeline
- Original: `originals/sascha-original.webp` (1179×1152, ICC-Profil). Ausgabe: `public/img/sascha-{448,640,832}.{avif,webp,jpg}`.
- Qualität: AVIF 72, WebP 88, JPEG 88; PSNR gegen skaliertes Original ≥ 41 dB (optisch verlustfrei). Metadaten werden nicht übernommen, ICC bleibt.
- Markup: `<picture>` mit AVIF→WebP→JPEG, `sizes="(min-width:1024px) 416px, (min-width:768px) 384px, (min-width:640px) 288px, 224px"`, `width/height=416`, `fetchPriority="high"`, Bild wird per `object-cover` quadratisch beschnitten (Ausschnitt darf sich nicht ändern).
- **Preload in `index.html`:** `imagesrcset` mit `/img/…` (ohne Basispfad) – Vite ergänzt `base` sonst doppelt.
- `public/og-image.png` (1200×630) wurde einmalig aus HTML mit headless Chrome gerendert (Fonts aus `node_modules/@fontsource`); die Quelle liegt nicht im Repo. Bei Änderung neu erzeugen und LinkedIn Post Inspector zum Cache-Leeren verwenden.

## 7. Rechtliches
- Impressum/Datenschutz (DE/EN) in `content.js`; Betreiber Sascha Rossi, Kleinunternehmer § 19 UStG, Hosting GitHub Pages, keine Cookies/Tracking, `localStorage` nur für die Sprachwahl. Texte sind Standardformulierungen, **nicht juristisch geprüft** – bei Änderungen (neue Dienste, Formulare, Tracking, Einbettungen) Datenschutztext anpassen lassen.

## 8. Verifikations-Rezepte (Browser-Vorschau)
- Viewports: 375 (mobile), 768 (tablet), 1280 (desktop). `html { scroll-behavior: smooth }` → für Messungen `document.documentElement.style.scrollBehavior='auto'` setzen.
- **Leere Screenshots:** Hintergrund-Tabs pausieren Framer-Animationen. Tab in den Vordergrund holen, weit wegscrollen und zurückscrollen, ~2 s warten (Opacity der `Reveal`-Wrapper prüfen).
- **Unverändert-Nachweis für Karten:** SHA-1 des `outerHTML` (ohne `style`-Attribute) der ersten drei Projektkarten vor/nach Änderung vergleichen, jeweils in DE und EN. Da Projektkarten beim Sprachwechsel neu gemountet werden, DOM-Knoten **nach** jedem Wechsel neu abfragen.
- Checks nach jeder Änderung: horizontaler Überlauf (`scrollWidth > innerWidth`), Elemente außerhalb des Viewports, Konsolenfehler, alle Anker (Sprung nach unten **und** oben: Überschrift unterhalb der Navigation), Sprachparität, Suche nach verbotenen Begriffen (`SUMAX`, `Lebenslauf`, `pgvector`, `RAG`, Telefonnummer/Privatmail).
- Live-Check nach Deploy: gebündeltes JS per `curl` laden und Strings zählen; Bilder unter `/img/` und Startseite auf HTTP 200; `/cv/…` muss 404 liefern. Hinweis: „IntersectionObserver“ steht legitim im Framer-Motion-Bundle.

## 9. Deployment, Git und Zugang
- Nur `main` wird deployt. Workflow-Datei `.github/workflows/deploy.yml` (Node 22, `npm ci`, Build, Pages-Artifact). Pages-Quelle: „GitHub Actions“.
- **GitHub CLI ist auf dem Rechner nicht global installiert.** In früheren Sitzungen: Release von `github.com/cli/cli` in den Scratchpad laden, Login per `gh auth login -h github.com -p https -w`; der Nutzer gibt den Device-Code im Browser selbst ein (Konto `sascharossi`). Push per lokalem Credential-Helper `gh auth git-credential`. Nach Sitzungsende Zugriff in den GitHub-Einstellungen widerrufen.
- Commit-Autor: GitHub-Noreply-Adresse (keine private E-Mail). Commit-Nachrichten deutsch, mit den vorgegebenen Co-Author-Zeilen.
- Force-Push wurde von der Sitzungs-Sicherheitsprüfung blockiert, bis der Nutzer eine Bash-Regel freigab; nur mit ausdrücklicher Anweisung und Freigabe verwenden.
- Preview-Server: `preview_start` liest `/Users/sumax/Claude Saschi/.claude/launch.json` (Eintrag `rossi-portfolio`, startet `npm --prefix … run dev` auf Port 5173).

## 10. Verwandte Projekte und externe Verweise
- **DJ-Website (Projekt 4):** eigenes öffentliches Repo `delarossi/Delarossi-Website-` (statisch: HTML5, CSS3, Vanilla JS, JSON-LD; Live `https://www.delarossi.de/`). Nur lesend als Belegquelle verwenden.
- LinkedIn: `https://www.linkedin.com/in/sascha-rossi` (Kurz-URL; alte URL mit Zahlensuffix ist ungültig). XING: `https://www.xing.com/profile/Sascha_Rossi`.
- LinkedIn-Profil wurde parallel überarbeitet (DE + EN-Version je Position); Website und Profil sollen konsistent bleiben (Arbeitgeber-Schreibweisen, Titel).

## 11. Bekannte Besonderheiten / offene Punkte
- „API-basierte Webintegrationen“ steht im Tech Stack auch in der EN-Version auf Deutsch (bewusst nicht geändert, weil nicht beauftragt).
- Alte lokale Branches (`optimierung`, `entfernung-cv`, `tech-stack-cards`, `projekt-dj-website`) sind gemergt und können gelöscht werden.
- Ideen, nicht beauftragt: Empfehlung der früheren Vorgesetzten als kurzer Abschnitt (nur mit deren Zustimmung), eigene Domain (dann `base` in `vite.config.js` und URLs in `index.html`/`README.md` anpassen).
- Git-Historie wurde einmal auf einen Commit zurückgesetzt, um private Kontaktdaten zu entfernen; alte Commit-IDs können bei GitHub noch kurz abrufbar sein.
