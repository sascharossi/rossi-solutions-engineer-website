import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Particles from './Particles.jsx'
import { i18n, links, techStack } from './content.js'

function readRoute() {
  const h = window.location.hash
  if (h === '#/impressum') return 'impressum'
  if (h === '#/datenschutz') return 'datenschutz'
  return 'home'
}

const sections = ['about', 'stack', 'work', 'projects', 'experience', 'contact']

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
    <div className="flex flex-col md:flex-row md:items-stretch gap-2 md:gap-1">
      {stages.map((nodes, i) => (
        <div key={i} className="contents">
          {i > 0 && (
            <svg viewBox="0 0 24 24" className="w-5 h-5 self-center shrink-0 text-accent rotate-90 md:rotate-0" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M5 12h14m-5-5 5 5-5 5" /></svg>
          )}
          <div className="flex flex-col justify-center gap-2 md:flex-1 min-w-0">
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
  <Reveal className="mb-12">
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
    document.documentElement.lang = lang
    try { localStorage.setItem('lang', lang) } catch { /* ignorieren */ }
  }, [lang])

  return (
    <>
      <Particles />

      {/* Navigation */}
      <header className="fixed top-4 inset-x-0 z-50 flex justify-center px-4">
        <nav className="flex items-center gap-1 md:gap-2 rounded-full border border-line bg-surface/80 backdrop-blur px-3 md:px-5 py-2 shadow-lg shadow-black/30">
          <a href="#top" className="font-bold text-sm md:text-base mr-2">SR<span className="text-accent">.</span></a>
          <div className="hidden lg:flex items-center gap-1">
            {sections.map((s) => (
              <a key={s} href={`#${s}`} className="px-3 py-1 text-sm text-muted hover:text-white transition-colors">{t.nav[s]}</a>
            ))}
          </div>
          <span className="hidden lg:block w-px h-5 bg-line mx-1" />
          <a href={links.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="p-1.5 text-muted hover:text-accent transition-colors">{Icon.linkedin}</a>
          <a href={links.xing} target="_blank" rel="noreferrer" aria-label="XING" className="p-1.5 text-muted hover:text-accent transition-colors">{Icon.xing}</a>
          <span className="w-px h-5 bg-line mx-1" />
          <div role="group" aria-label={t.langLabel} className="flex text-xs font-mono">
            {['de', 'en'].map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                aria-pressed={lang === l}
                className={`px-2.5 py-1 rounded-full uppercase transition-colors ${lang === l ? 'bg-accent-deep text-white' : 'text-muted hover:text-white'}`}
              >
                {l}
              </button>
            ))}
          </div>
        </nav>
      </header>

      {route !== 'home' ? (
        <main className="px-6 pt-32 pb-24">
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
        <section className="min-h-screen flex items-center px-6 pt-28 pb-16">
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
                <img src={`${import.meta.env.BASE_URL}sascha.jpg`} alt="Sascha Rossi" width="360" height="360" className="relative w-56 h-56 sm:w-72 sm:h-72 md:w-96 md:h-96 lg:w-[26rem] lg:h-[26rem] object-cover rounded-3xl border border-line" />
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
        <section id="about" className="px-6 py-24">
          <div className="max-w-6xl mx-auto">
            <Heading label={t.about.label} title={t.about.title} />
            <div className="grid lg:grid-cols-2 gap-12">
              <div className="space-y-5 text-muted text-lg leading-relaxed">
                {t.about.paras.map((p, i) => <Reveal key={i} delay={i * 0.08}><p>{p}</p></Reveal>)}
              </div>
              <Reveal>
                <div className="rounded-2xl border border-line bg-surface/70 p-6 md:p-8">
                  <h3 className="font-mono text-sm uppercase tracking-widest text-accent mb-6">{t.about.eduTitle}</h3>
                  <ul className="space-y-4">
                    {t.about.education.map(([year, title, sub]) => (
                      <li key={year + title} className="flex gap-4">
                        <span className="font-mono text-sm text-accent w-10 shrink-0 pt-0.5">{year}</span>
                        <span><span className="font-medium">{title}</span>{sub && <span className="block text-sm text-muted">{sub}</span>}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Tech Stack */}
        <section id="stack" className="px-6 py-24">
          <div className="max-w-6xl mx-auto">
            <Heading label={t.stack.label} title={t.stack.title} />
            <div className="grid md:grid-cols-2 gap-x-10 gap-y-8">
              {techStack.map((g, i) => (
                <Reveal key={g.key} delay={(i % 2) * 0.08}>
                  <h3 className="font-mono text-sm uppercase tracking-widest text-accent mb-3">{t.stack.groups[g.key]}</h3>
                  <div className="flex flex-wrap gap-2">
                    {g.items.map((it) => (
                      <span key={it} className="rounded-full border border-line bg-surface/70 px-3 py-1 text-sm text-slate-200 hover:border-accent/60 transition-colors">{it}</span>
                    ))}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Projektfelder */}
        <section id="work" className="px-6 py-24">
          <div className="max-w-6xl mx-auto">
            <Heading label={t.work.label} title={t.work.title} />
            <div className="grid md:grid-cols-2 gap-5">
              {t.work.items.map(([title, text, tags], i) => (
                <Reveal key={title} delay={(i % 2) * 0.08}>
                  <article className="h-full rounded-2xl border border-line bg-gradient-to-br from-surface to-bg p-7 hover:border-accent/60 transition-colors">
                    <h3 className="text-xl font-semibold">{title}</h3>
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
        <section id="projects" className="px-6 py-24">
          <div className="max-w-6xl mx-auto">
            <Heading label={t.projects.label} title={t.projects.title} />
            <Reveal className="-mt-6 mb-10"><p className="text-muted text-lg">{t.projects.intro}</p></Reveal>
            <div className="space-y-8">
              {t.projects.items.map((p, idx) => (
                <Reveal key={p.title}>
                  <article className="rounded-2xl border border-line bg-surface/70 p-6 md:p-8">
                    <p className="font-mono text-sm text-accent">0{idx + 1} · {p.scope}</p>
                    <h3 className="mt-2 text-2xl md:text-3xl font-bold tracking-tight">{p.title}</h3>
                    <p className="mt-1 text-sm text-muted">{t.projects.role}</p>
                    <div className="mt-6 grid lg:grid-cols-2 gap-8">
                      <div className="space-y-5">
                        <div>
                          <h4 className="font-mono text-xs uppercase tracking-widest text-accent mb-2">{t.projects.problem}</h4>
                          <p className="text-muted leading-relaxed">{p.problem}</p>
                        </div>
                        <div>
                          <h4 className="font-mono text-xs uppercase tracking-widest text-accent mb-2">{t.projects.solution}</h4>
                          <p className="text-muted leading-relaxed">{p.solution}</p>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-mono text-xs uppercase tracking-widest text-accent mb-2">{t.projects.highlights}</h4>
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
                    <div className="mt-8">
                      <h4 className="font-mono text-xs uppercase tracking-widest text-accent mb-3">{t.projects.results}</h4>
                      <div className="grid sm:grid-cols-3 gap-3">
                        {p.metrics.map(([value, label]) => (
                          <div key={label} className="rounded-xl border border-line bg-bg/70 p-4">
                            <p className="font-display text-3xl font-bold text-accent">{value}</p>
                            <p className="mt-1 text-sm text-muted">{label}</p>
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
                    <div className="mt-8">
                      <h4 className="font-mono text-xs uppercase tracking-widest text-accent mb-3">{t.projects.flow}</h4>
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

        {/* Erfahrung */}
        <section id="experience" className="px-6 py-24">
          <div className="max-w-4xl mx-auto">
            <Heading label={t.experience.label} title={t.experience.title} />
            <ol className="relative border-l border-line ml-2 space-y-10">
              {t.experience.items.map(([date, role, company, text]) => (
                <li key={date} className="pl-8 relative">
                  <span className="absolute -left-[7px] top-1.5 w-3 h-3 rounded-full bg-accent ring-4 ring-bg" />
                  <Reveal>
                    <p className="font-mono text-sm text-accent">{date}</p>
                    <h3 className="mt-1 text-xl font-semibold">{role} <span className="text-muted font-normal">· {company}</span></h3>
                    <p className="mt-3 text-muted leading-relaxed">{text}</p>
                  </Reveal>
                </li>
              ))}
            </ol>
            <Reveal className="mt-12 rounded-2xl border border-line bg-surface/70 p-6">
              <h3 className="font-semibold">{t.experience.earlierTitle}</h3>
              <p className="mt-2 text-muted leading-relaxed">{t.experience.earlier}</p>
            </Reveal>
          </div>
        </section>

        {/* Kontakt */}
        <section id="contact" className="px-6 py-28">
          <Reveal className="max-w-4xl mx-auto text-center rounded-3xl border border-line bg-gradient-to-br from-accent-deep/25 via-surface to-bg p-10 md:p-16">
            <p className="font-mono text-sm tracking-widest uppercase text-accent mb-4">{t.contact.label}</p>
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight leading-snug">{t.contact.title}</h2>
            <p className="mt-4 text-muted text-lg">{t.contact.text}</p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <a href={`mailto:${links.email}`} className="inline-flex items-center gap-2 rounded-full bg-accent-deep hover:bg-accent text-white hover:text-bg font-semibold px-7 py-3 transition-colors">{Icon.mail}{t.contact.mail}</a>
              <a href={links.linkedin} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-line hover:border-accent font-semibold px-6 py-3 transition-colors">{Icon.linkedin}LinkedIn</a>
              <a href={links.xing} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-line hover:border-accent font-semibold px-6 py-3 transition-colors">{Icon.xing}XING</a>
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
