import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Particles from './Particles.jsx'
import { i18n, links, primaryTech, techStack } from './content.js'

function readRoute() {
  const h = window.location.hash
  if (h === '#/impressum') return 'impressum'
  if (h === '#/datenschutz') return 'datenschutz'
  return 'home'
}

const sections = ['about', 'work', 'projects', 'stack', 'experience', 'education', 'contact']
const primarySet = new Set(primaryTech)
const chip = 'rounded-full border border-line bg-bg/60 px-3 py-1 text-sm text-slate-200'
const eyebrow = 'font-mono text-xs uppercase tracking-widest text-accent'
// Hero-Foto: Varianten aus scripts/optimize-hero.py (AVIF/WebP/JPEG, je 448/640/832 px breit)
const HERO_WIDTHS = [448, 640, 832]
const HERO_SIZES = '(min-width: 1024px) 416px, (min-width: 768px) 384px, (min-width: 640px) 288px, 224px'
const heroSet = (ext) => HERO_WIDTHS.map((w) => `${import.meta.env.BASE_URL}img/sascha-${w}.${ext} ${w}w`).join(', ')
const sectionPad = 'px-5 sm:px-6 py-14 md:py-24'

// true, solange der Viewport der Media-Query entspricht
function useMedia(query) {
  const [match, setMatch] = useState(() => window.matchMedia(query).matches)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const on = () => setMatch(mq.matches)
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [query])
  return match
}

// Scroll-Zustand für die Navigation: weit gescrollt = kompakt, nach unten scrollen = ausblenden, nach oben = wieder zeigen
function useScrollNav() {
  const [state, setState] = useState({ scrolled: false, hidden: false })
  useEffect(() => {
    let last = window.scrollY
    let ticking = false
    const update = () => {
      const y = window.scrollY
      const delta = y - last
      setState((prev) => {
        const scrolled = y > 80
        let hidden = prev.hidden
        if (y < 120) hidden = false
        else if (delta > 6) hidden = true
        else if (delta < -6) hidden = false
        return prev.scrolled === scrolled && prev.hidden === hidden ? prev : { scrolled, hidden }
      })
      if (Math.abs(delta) > 6) last = y
      ticking = false
    }
    const onScroll = () => {
      if (!ticking) { ticking = true; requestAnimationFrame(update) }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return state
}

function initialLang() {
  try {
    const saved = localStorage.getItem('lang')
    if (saved === 'de' || saved === 'en') return saved
  } catch { /* localStorage nicht verfügbar */ }
  return navigator.language?.toLowerCase().startsWith('de') ? 'de' : 'en'
}

const Reveal = ({ children, delay = 0, className = '' }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.6, delay, ease: 'easeOut' }}
  >
    {children}
  </motion.div>
)

// Datenfluss-Diagramm: Stufen von links nach rechts (mobil von oben nach unten), Knoten einer Stufe laufen parallel
function Flow({ stages }) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-stretch gap-1.5 lg:gap-1 max-w-md sm:max-w-lg mx-auto lg:max-w-none">
      {stages.map((nodes, i) => (
        <div key={i} className="contents">
          {i > 0 && (
            <svg viewBox="0 0 24 24" className="w-5 h-5 self-center shrink-0 text-accent rotate-90 lg:rotate-0" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M5 12h14m-5-5 5 5-5 5" /></svg>
          )}
          <div className={`justify-center gap-2 lg:flex-1 min-w-0 ${nodes.length > 1 ? 'grid grid-cols-2 lg:flex lg:flex-col' : 'flex flex-col'}`}>
            {nodes.map(([title, sub]) => (
              <div key={title} className="rounded-xl border border-line bg-bg/70 px-3 py-2.5 text-center">
                <p className="text-sm font-medium leading-snug">{title}</p>
                {sub && <p className="mt-0.5 text-xs text-muted leading-snug">{sub}</p>}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

const Heading = ({ label, title }) => (
  <Reveal className="mb-8 md:mb-12">
    <p className="font-mono text-sm tracking-widest uppercase text-accent mb-3">{label}</p>
    <h2 className="text-3xl md:text-5xl font-bold tracking-tight">{title}</h2>
  </Reveal>
)

const Icon = {
  linkedin: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.75h4V21H3zM9.5 9.75h3.8v1.6h.06c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.77 2.65 4.77 6.1V21h-4v-4.9c0-1.17-.02-2.67-1.63-2.67-1.63 0-1.88 1.27-1.88 2.58V21h-4z" /></svg>
  ),
  xing: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor"><path d="M18.19 0c-.4 0-.58.25-.72.5l-6.2 10.98 3.95 7.24c.14.25.3.5.72.5h3.4c.2 0 .33-.08.4-.2.08-.15.07-.32-.02-.5l-3.9-7.15L21.9.7c.1-.17.1-.35.02-.5-.07-.13-.2-.2-.4-.2zM4.9 4.3c-.2 0-.36.08-.44.2-.08.15-.07.33.02.5l2.3 3.97-3.6 6.35c-.1.18-.1.35-.02.5.08.13.22.2.4.2h3.4c.4 0 .6-.25.73-.5L11.4 9c-.05-.1-1.4-2.5-2.5-4.3-.13-.24-.3-.4-.72-.4z" /></svg>
  ),
  mail: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>
  ),
}

export default function App() {
  const [lang, setLang] = useState(initialLang)
  const t = i18n[lang]
  const [route, setRoute] = useState(readRoute)
  const [menuOpen, setMenuOpen] = useState(false)
  const isCompactViewport = useMedia('(max-width: 1023px)')
  const { scrolled, hidden } = useScrollNav()
  const compact = isCompactViewport && scrolled
  const menuShown = menuOpen && compact
  const navHidden = isCompactViewport && hidden && !menuShown

  useEffect(() => {
    const onHash = () => setRoute(readRoute())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  // Nach Routenwechsel: Rechtstexte oben starten, auf der Startseite zum Anker springen
  useEffect(() => {
    if (route !== 'home') { window.scrollTo(0, 0); return }
    const id = window.location.hash.slice(1)
    if (id && !id.startsWith('/')) document.getElementById(id)?.scrollIntoView()
    else if (!id) window.scrollTo(0, 0)
  }, [route])

  useEffect(() => {
    if (!menuShown) return
    const onKey = (e) => { if (e.key === 'Escape') setMenuOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuShown])

  useEffect(() => {
    document.documentElement.lang = lang
    try { localStorage.setItem('lang', lang) } catch { /* ignorieren */ }
  }, [lang])

  return (
    <>
      <Particles />

      {/* Navigation: groß im Hero, mobil beim Scrollen kompakt und ausblendbar */}
      {menuShown && <button type="button" aria-label={t.nav.close} onClick={() => setMenuOpen(false)} className="fixed inset-0 z-40 cursor-default" />}
      <motion.header
        className="fixed top-2 lg:top-4 inset-x-0 z-50 flex justify-center px-4 pointer-events-none"
        animate={{ y: navHidden ? -90 : 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <div className="relative pointer-events-auto">
          <nav className={`flex items-center gap-1 md:gap-2 rounded-full border border-line bg-surface/85 backdrop-blur px-3 md:px-5 ${compact ? 'py-0.5' : 'py-1.5'} lg:py-2 shadow-lg shadow-black/30 transition-[padding] duration-300`}>
            <a href="#top" className="font-bold text-sm md:text-base mr-1 md:mr-2 py-1.5">SR<span className="text-accent">.</span></a>
            <div className="hidden lg:flex items-center gap-1">
              {sections.map((s) => (
                <a key={s} href={`#${s}`} className="px-3 py-1 text-sm text-muted hover:text-white transition-colors">{t.nav[s]}</a>
              ))}
            </div>
            <span className="hidden lg:block w-px h-5 bg-line mx-1" />
            <AnimatePresence initial={false}>
              {!compact && (
                <motion.div
                  key="social"
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 'auto', opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="flex items-center overflow-hidden"
                >
                  <a href={links.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="p-2 text-muted hover:text-accent transition-colors">{Icon.linkedin}</a>
                  <a href={links.xing} target="_blank" rel="noreferrer" aria-label="XING" className="p-2 text-muted hover:text-accent transition-colors">{Icon.xing}</a>
                  <span className="w-px h-5 bg-line mx-1 shrink-0" />
                </motion.div>
              )}
            </AnimatePresence>
            <div role="group" aria-label={t.langLabel} className="flex text-xs font-mono">
              {['de', 'en'].map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  aria-pressed={lang === l}
                  className={`relative before:absolute before:-inset-y-2 before:inset-x-0 before:content-[''] px-3 py-1.5 rounded-full uppercase transition-colors ${lang === l ? 'bg-accent-deep text-white' : 'text-muted hover:text-white'}`}
                >
                  {l}
                </button>
              ))}
            </div>
            <AnimatePresence initial={false}>
              {compact && (
                <motion.div
                  key="menu"
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 'auto', opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="flex items-center overflow-hidden"
                >
                  <span className="w-px h-5 bg-line mx-1 shrink-0" />
                  <button
                    type="button"
                    onClick={() => setMenuOpen((o) => !o)}
                    aria-expanded={menuShown}
                    aria-controls="mobile-menu"
                    className="relative before:absolute before:-inset-y-2 before:inset-x-0 before:content-[''] flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono uppercase text-muted hover:text-white transition-colors whitespace-nowrap"
                  >
                    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      {menuShown ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
                    </svg>
                    {t.nav.menu}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </nav>
          <div className="absolute left-1/2 top-full -translate-x-1/2 w-[min(22rem,calc(100vw-2rem))] pt-2">
            <AnimatePresence>
              {menuShown && (
                <motion.div
                  id="mobile-menu"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  className="rounded-2xl border border-line bg-surface/95 backdrop-blur p-2 shadow-xl shadow-black/40"
                >
                  <ul>
                    {sections.map((s) => (
                      <li key={s}>
                        <a href={`#${s}`} onClick={() => setMenuOpen(false)} className="block rounded-xl px-4 py-3 text-base text-slate-200 hover:bg-bg/70 hover:text-white transition-colors">{t.nav[s]}</a>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-1 flex gap-2 border-t border-line p-2">
                    <a href={links.linkedin} target="_blank" rel="noreferrer" className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-line px-3 py-2.5 text-sm hover:border-accent transition-colors">{Icon.linkedin}LinkedIn</a>
                    <a href={links.xing} target="_blank" rel="noreferrer" className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-line px-3 py-2.5 text-sm hover:border-accent transition-colors">{Icon.xing}XING</a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.header>

      {route !== 'home' ? (
        <main className="px-5 sm:px-6 pt-28 md:pt-32 pb-16 md:pb-24">
          <div className="max-w-3xl mx-auto">
            <a href="#" className="text-sm text-accent hover:underline">{t.legal.back}</a>
            <h1 className="mt-6 mb-10 text-4xl md:text-5xl font-bold tracking-tight">{t.legal[route].title}</h1>
            <div className="space-y-8">
              {t.legal[route].blocks.map(([h, paras]) => (
                <section key={h}>
                  <h2 className="text-xl font-semibold mb-3">{h}</h2>
                  <div className="space-y-3 text-muted leading-relaxed">
                    {paras.map((p, i) => <p key={i}>{p}</p>)}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </main>
      ) : (
      <main id="top">
        {/* Hero */}
        <section className="md:min-h-screen flex items-center px-5 sm:px-6 pt-28 pb-12 md:pb-16">
          <div className="max-w-6xl mx-auto w-full grid md:grid-cols-[1fr_auto] md:grid-rows-[auto_auto] gap-x-12 gap-y-8 md:items-center">
            <div className="md:col-start-1 md:row-start-1 md:self-end">
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="font-mono text-accent mb-4">{t.hero.eyebrow}</motion.p>
              <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.7 }} className="font-display text-5xl sm:text-6xl md:text-8xl font-bold tracking-tight leading-[0.95] grad-text">
                Sascha<br />Rossi
              </motion.h1>
            </div>
            <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4, duration: 0.8 }} className="md:col-start-2 md:row-start-1 md:row-span-2 md:self-center">
              <div className="relative w-fit">
                <div className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-accent-deep/60 to-transparent blur-2xl" />
                <picture className="block">
                  <source type="image/avif" srcSet={heroSet('avif')} sizes={HERO_SIZES} />
                  <source type="image/webp" srcSet={heroSet('webp')} sizes={HERO_SIZES} />
                  <img
                    src={`${import.meta.env.BASE_URL}img/sascha-640.jpg`}
                    srcSet={heroSet('jpg')}
                    sizes={HERO_SIZES}
                    alt="Sascha Rossi"
                    width="416"
                    height="416"
                    fetchPriority="high"
                    decoding="async"
                    className="relative block w-56 h-56 sm:w-72 sm:h-72 md:w-96 md:h-96 lg:w-[26rem] lg:h-[26rem] object-cover rounded-3xl border border-line"
                  />
                </picture>
              </div>
            </motion.div>
            <div className="md:col-start-1 md:row-start-2 md:self-start">
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-xl md:text-2xl font-semibold">{t.hero.role}</motion.p>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mt-1 font-mono text-sm text-muted">{t.hero.areas}</motion.p>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.75 }} className="mt-8 max-w-2xl text-muted text-lg leading-relaxed">{t.hero.text}</motion.p>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.85 }} className="mt-6 text-accent font-semibold tracking-wide">{t.hero.claim}</motion.p>
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }} className="mt-10 flex flex-wrap gap-4">
                <a href="#contact" className="rounded-full bg-accent-deep hover:bg-accent text-white hover:text-bg font-semibold px-7 py-3 transition-colors">{t.hero.cta}</a>
                <a href="#about" className="rounded-full border border-line hover:border-accent text-white font-semibold px-7 py-3 transition-colors">{t.hero.cta2}</a>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Über mich */}
        <section id="about" className={sectionPad}>
          <div className="max-w-6xl mx-auto">
            <Heading label={t.about.label} title={t.about.title} />
            <div className="grid lg:grid-cols-[1.15fr_1fr] gap-6 lg:gap-12">
              <div className="space-y-4 md:space-y-5 text-muted text-base md:text-lg leading-relaxed">
                {t.about.paras.map((p, i) => <Reveal key={i} delay={i * 0.08}><p>{p}</p></Reveal>)}
              </div>
              <div className="space-y-3 md:space-y-5">
                <Reveal>
                  <div className="rounded-2xl border border-line bg-surface/70 p-4 md:p-6">
                    <h3 className={`${eyebrow} mb-3 md:mb-4`}>{t.about.connectTitle}</h3>
                    <div className="flex flex-wrap gap-1.5 md:gap-2">
                      {t.about.connect.map((c) => <span key={c} className="rounded-full border border-accent-deep/70 bg-accent-deep/20 px-2.5 md:px-3 py-0.5 md:py-1 text-[13px] md:text-sm font-medium text-white">{c}</span>)}
                    </div>
                  </div>
                </Reveal>
                <Reveal delay={0.08}>
                  <div className="rounded-2xl border border-line bg-surface/70 p-4 md:p-6">
                    <h3 className={`${eyebrow} mb-3 md:mb-4`}>{t.about.beforeTitle}</h3>
                    <div className="flex flex-wrap gap-1.5 md:gap-2">
                      {t.about.before.map((c) => <span key={c} className="rounded-full border border-line bg-bg/60 px-2.5 md:px-3 py-0.5 md:py-1 text-[13px] md:text-sm text-slate-200">{c}</span>)}
                    </div>
                  </div>
                </Reveal>
              </div>
            </div>
            <Reveal className="mt-8 md:mt-14">
              <blockquote className="border-l-2 border-accent pl-5 md:pl-6 font-display text-xl md:text-3xl font-bold tracking-tight leading-snug grad-text">
                {t.about.quote}
              </blockquote>
            </Reveal>
          </div>
        </section>

        {/* Schwerpunkte */}
        <section id="work" className={sectionPad}>
          <div className="max-w-6xl mx-auto">
            <Heading label={t.work.label} title={t.work.title} />
            <div className="grid md:grid-cols-2 gap-4 md:gap-5">
              {t.work.items.map(([title, text, tags], i) => (
                <Reveal key={title} delay={(i % 2) * 0.08}>
                  <article className="h-full rounded-2xl border border-line bg-gradient-to-br from-surface to-bg p-5 md:p-7 hover:border-accent/60 transition-colors">
                    <h3 className="text-lg md:text-xl font-semibold">{title}</h3>
                    <p className="mt-3 text-muted leading-relaxed">{text}</p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {tags.map((tag) => <span key={tag} className="font-mono text-xs text-accent border border-accent-deep/60 rounded px-2 py-0.5">{tag}</span>)}
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Projekte */}
        <section id="projects" className={sectionPad}>
          <div className="max-w-6xl mx-auto">
            <Heading label={t.projects.label} title={t.projects.title} />
            <Reveal className="-mt-4 md:-mt-6 mb-8 md:mb-10"><p className="text-muted text-base md:text-lg">{t.projects.intro}</p></Reveal>
            <div className="space-y-6 md:space-y-8">
              {t.projects.items.map((p, idx) => (
                <Reveal key={p.title}>
                  <article className="rounded-2xl border border-line bg-surface/70 p-5 md:p-8">
                    <p className="font-mono text-sm text-accent">0{idx + 1} · {p.scope}</p>
                    <h3 className="mt-2 text-xl md:text-3xl font-bold tracking-tight">{p.title}</h3>
                    <p className="mt-1 text-sm text-muted">{t.projects.role}</p>
                    {p.principle && (
                      <div className="mt-5 rounded-xl border border-accent-deep/70 bg-accent-deep/15 p-4 md:p-5">
                        <p className={`${eyebrow} mb-1.5`}>{t.projects.principleLabel}</p>
                        <p className="font-display text-base md:text-xl font-bold leading-snug">{p.principle}</p>
                      </div>
                    )}
                    <div className="mt-6 grid lg:grid-cols-2 gap-6 lg:gap-8">
                      <div className="space-y-5">
                        <div>
                          <h4 className={`${eyebrow} mb-2`}>{t.projects.problem}</h4>
                          <p className="text-muted leading-relaxed">{p.problem}</p>
                        </div>
                        <div>
                          <h4 className={`${eyebrow} mb-2`}>{t.projects.solution}</h4>
                          <p className="text-muted leading-relaxed">{p.solution}</p>
                        </div>
                      </div>
                      <div>
                        <h4 className={`${eyebrow} mb-2`}>{t.projects.highlights}</h4>
                        <ul className="space-y-2">
                          {p.points.map((pt) => (
                            <li key={pt} className="flex gap-3 text-muted leading-relaxed">
                              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                              <span>{pt}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="mt-7 md:mt-8">
                      <h4 className={`${eyebrow} mb-3`}>{t.projects.results}</h4>
                      <div className="grid sm:grid-cols-3 gap-2 sm:gap-3">
                        {p.metrics.map(([value, label]) => (
                          <div key={label} className="rounded-xl border border-line bg-bg/70 px-4 py-3 sm:p-4 flex items-baseline gap-4 sm:block">
                            <p className="font-display text-2xl sm:text-3xl font-bold text-accent shrink-0 min-w-[6.5rem] sm:min-w-0">{value}</p>
                            <p className="sm:mt-1 text-sm text-muted">{label}</p>
                          </div>
                        ))}
                      </div>
                      <ul className="mt-4 space-y-2">
                        {p.results.map((r) => (
                          <li key={r} className="flex gap-3 text-muted leading-relaxed">
                            <span className="mt-2 w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                            <span>{r}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="mt-7 md:mt-8">
                      <h4 className={`${eyebrow} mb-3`}>{t.projects.flow}</h4>
                      <Flow stages={p.flow} />
                    </div>
                    <div className="mt-6 flex flex-wrap gap-2">
                      {p.tags.map((tag) => <span key={tag} className="font-mono text-xs text-accent border border-accent-deep/60 rounded px-2 py-0.5">{tag}</span>)}
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Tech Stack */}
        <section id="stack" className={sectionPad}>
          <div className="max-w-6xl mx-auto">
            <Heading label={t.stack.label} title={t.stack.title} />
            <Reveal className="-mt-4 md:-mt-6 mb-8"><p className="text-muted">{t.stack.note}</p></Reveal>
            <div className="grid md:grid-cols-2 gap-x-10 gap-y-7 md:gap-y-8">
              {techStack.map((g, i) => (
                <Reveal key={g.key} delay={(i % 2) * 0.08}>
                  <h3 className={`${eyebrow} mb-3 text-sm`}>{t.stack.groups[g.key]}</h3>
                  <div className="flex flex-wrap gap-2">
                    {g.items.map((it) => primarySet.has(it) ? (
                      <span key={it} className="rounded-full border border-accent-deep/70 bg-accent-deep/20 px-3 py-1 text-sm font-medium text-white">{it}</span>
                    ) : (
                      <span key={it} className="rounded-full border border-line bg-surface/70 px-3 py-1 text-sm text-muted">{it}</span>
                    ))}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Erfahrung */}
        <section id="experience" className={sectionPad}>
          <div className="max-w-4xl mx-auto">
            <Heading label={t.experience.label} title={t.experience.title} />
            <ol className="relative border-l border-line ml-2 space-y-9 md:space-y-10">
              {t.experience.items.map(([date, role, company, text, tags]) => (
                <li key={date} className="pl-6 md:pl-8 relative">
                  <span className="absolute -left-[7px] top-1.5 w-3 h-3 rounded-full bg-accent ring-4 ring-bg" />
                  <Reveal>
                    <p className="font-mono text-sm text-accent">{date}</p>
                    <h3 className="mt-1 text-lg md:text-xl font-semibold">{role} <span className="text-muted font-normal">· {company}</span></h3>
                    <p className="mt-3 text-muted leading-relaxed">{text}</p>
                    {tags && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {tags.map((tag) => <span key={tag} className="font-mono text-xs text-accent border border-accent-deep/60 rounded px-2 py-0.5">{tag}</span>)}
                      </div>
                    )}
                  </Reveal>
                </li>
              ))}
            </ol>
            <Reveal className="mt-10 md:mt-12 rounded-2xl border border-line bg-surface/70 p-5 md:p-7">
              <h3 className="text-lg md:text-xl font-semibold">{t.experience.earlierTitle}</h3>
              <p className="mt-2 text-muted leading-relaxed">{t.experience.earlierIntro}</p>
              <ul className="mt-4 grid sm:grid-cols-2 gap-x-6 gap-y-2">
                {t.experience.earlierItems.map((it) => (
                  <li key={it} className="flex gap-3 leading-relaxed">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
              <h4 className={`${eyebrow} mt-6 mb-3`}>{t.experience.earlierLinksTitle}</h4>
              <div className="flex flex-wrap gap-2">
                {t.experience.earlierLinks.map((it) => <span key={it} className={chip}>{it}</span>)}
              </div>
            </Reveal>
          </div>
        </section>

        {/* Ausbildung & Qualifikationen */}
        <section id="education" className={sectionPad}>
          <div className="max-w-4xl mx-auto">
            <Heading label={t.education.label} title={t.education.title} />
            <div className="grid sm:grid-cols-2 gap-3 md:gap-4">
              {t.education.items.map(([year, title, sub]) => (
                <Reveal key={year + title}>
                  <div className="h-full rounded-2xl border border-line bg-surface/70 p-4 md:p-5 flex gap-4">
                    <span className="font-mono text-sm text-accent w-11 shrink-0 pt-0.5">{year}</span>
                    <span><span className="font-medium leading-snug">{title}</span>{sub && <span className="block text-sm text-muted mt-0.5">{sub}</span>}</span>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Kontakt */}
        <section id="contact" className="px-5 sm:px-6 py-16 md:py-28">
          <Reveal className="max-w-4xl mx-auto text-center rounded-3xl border border-line bg-gradient-to-br from-accent-deep/25 via-surface to-bg p-7 sm:p-10 md:p-16">
            <p className="font-mono text-sm tracking-widest uppercase text-accent mb-4">{t.contact.label}</p>
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight leading-snug">{t.contact.title}</h2>
            <p className="mt-4 text-muted text-lg">{t.contact.text}</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a href={`mailto:${links.email}`} className="inline-flex items-center gap-2 rounded-full bg-accent-deep hover:bg-accent text-white hover:text-bg font-semibold px-7 py-3 transition-colors">{Icon.mail}{t.contact.mail}</a>
              <a href={links.linkedin} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-line hover:border-accent font-semibold px-5 py-3 transition-colors">{Icon.linkedin}LinkedIn</a>
              <a href={links.xing} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-line hover:border-accent font-semibold px-5 py-3 transition-colors">{Icon.xing}XING</a>
            </div>
          </Reveal>
        </section>
      </main>
      )}

      <footer className="px-6 py-8 text-center text-sm text-muted border-t border-line">
        <p>© 2026 {t.footer}</p>
        <p className="mt-2 flex justify-center gap-4">
          <a href="#/impressum" className="hover:text-accent">{t.footerLinks.impressum}</a>
          <a href="#/datenschutz" className="hover:text-accent">{t.footerLinks.datenschutz}</a>
        </p>
      </footer>
    </>
  )
}
