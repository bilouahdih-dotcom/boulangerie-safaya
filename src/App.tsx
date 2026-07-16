import { useEffect, useMemo, useState } from "react"
import { AnimatePresence, motion, useScroll, useSpring, useTransform } from "motion/react"
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Award,
  Clock3,
  MapPin,
  Menu,
  Navigation,
  Phone,
  Quote,
  Star,
  TrainFront,
  Wheat,
  X,
} from "lucide-react"
import { AnimatedNav } from "@/components/AnimatedNav"
import { AtelierInterlude } from "@/components/AtelierInterlude"
import { BakeryTimeline } from "@/components/BakeryTimeline"
import { MagneticLink } from "@/components/MagneticLink"
import { Button } from "@/components/ui/button"

type ProductKind = "croissant" | "pain" | "tarte"

const products: Array<{
  id: ProductKind
  number: string
  short: string
  title: string
  description: string
  proof: string
  note: string
  image: string
  alt: string
}> = [
  {
    id: "croissant",
    number: "01",
    short: "Le feuilleté",
    title: "Un croissant qui laisse des miettes. Pas de doute.",
    description: "Une pousse lente, une croûte fine et ce craquant net que l’on reconnaît avant même la première bouchée.",
    proof: "Top 10 départemental",
    note: "Beurre · Pousse lente · Dorure minute",
    image: "/images/croissants-dark.jpg",
    alt: "Deux croissants dorés éclairés sur un fond noir",
  },
  {
    id: "pain",
    number: "02",
    short: "Le campagne",
    title: "Le pain de campagne classé premier.",
    description: "Une croûte profonde, une mie souple et une fermentation maîtrisée. La pièce qui a obtenu la meilleure note du concours 2024.",
    proof: "Meilleure note 2024",
    note: "Levain · Fermentation longue · Farine française",
    image: "/images/sourdough-rack.jpg",
    alt: "Pain de campagne artisanal refroidissant sur une grille",
  },
  {
    id: "tarte",
    number: "03",
    short: "La pâtisserie",
    title: "Du citron franc. Une finition précise.",
    description: "Tartelette citron, flan coco, mille-feuille : une vitrine généreuse où chaque classique garde du caractère.",
    proof: "Plébiscitée par les habitués",
    note: "Citron · Crème lisse · Fond croustillant",
    image: "/images/lemon-tart.jpg",
    alt: "Tarte au citron meringuée à la finition artisanale",
  },
]

const reviews = [
  {
    quote: "Bon pain, très bonne briochette au sucre. Hâte de tester le reste.",
    author: "Louise",
    source: "Avis Google",
  },
  {
    quote: "La bûche écureuil, le mille-feuille et les pains : c’était divin comme d’habitude.",
    author: "Catherine",
    source: "Cliente fidèle",
  },
  {
    quote: "Personnel adorable, service rapide, tartelette citron et flan coco vraiment savoureux.",
    author: "Ambre",
    source: "Avis Google",
  },
]

function getOpenState() {
  const now = new Date()
  const day = now.getDay()
  const current = now.getHours() * 60 + now.getMinutes()
  const isSunday = day === 0
  const isMonday = day === 1
  const opens = isSunday ? 7 * 60 : 6 * 60 + 30
  const closes = isSunday ? 19 * 60 : 20 * 60
  const open = !isMonday && current >= opens && current < closes

  if (open) return { open: true, label: `Ouvert jusqu’à ${isSunday ? "19h" : "20h"}` }
  if (isMonday) return { open: false, label: "Fermé le lundi" }
  if (current < opens) return { open: false, label: `Ouvre à ${isSunday ? "7h" : "6h30"}` }
  return { open: false, label: isSunday ? "Ouvre mardi à 6h30" : "Ouvre demain à 6h30" }
}

function IntroCurtain() {
  return (
    <motion.div
      className="intro-curtain"
      initial={{ y: 0 }}
      exit={{ y: "-100%" }}
      transition={{ duration: .9, ease: [.76, 0, .24, 1] }}
    >
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .45 }} className="intro-brand">
        <span>S</span>
        <div>SAFAYA<small>BOULANGERIE · PÂTISSERIE</small></div>
      </motion.div>
      <div className="intro-progress"><motion.i initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: .72, ease: "easeInOut" }} /></div>
    </motion.div>
  )
}

function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 44 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12%" }}
      transition={{ duration: .8, delay, ease: [.16, 1, .3, 1] }}
    >
      {children}
    </motion.div>
  )
}

function SectionLabel({ number, children, light = false }: { number: string; children: React.ReactNode; light?: boolean }) {
  return <div className={`section-label ${light ? "is-light" : ""}`}><span>{number}</span><i />{children}</div>
}

function App() {
  const [showIntro, setShowIntro] = useState(() => !new URLSearchParams(window.location.search).has("skipIntro"))
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeProduct, setActiveProduct] = useState<ProductKind>("croissant")
  const openState = useMemo(getOpenState, [])
  const active = products.find((product) => product.id === activeProduct) ?? products[0]
  const { scrollY, scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: .25 })
  const headerCompact = useTransform(scrollY, [0, 100], [0, 1])
  const heroCopyY = useTransform(scrollY, [0, 700], [0, 120])
  const heroVisualY = useTransform(scrollY, [0, 700], [0, -55])
  const heroVisualScale = useTransform(scrollY, [0, 700], [1, .94])

  const changeProduct = (direction: -1 | 1) => {
    const currentIndex = products.findIndex((product) => product.id === activeProduct)
    const nextIndex = (currentIndex + direction + products.length) % products.length
    setActiveProduct(products[nextIndex].id)
  }

  useEffect(() => {
    if (!showIntro) return
    const timeout = window.setTimeout(() => setShowIntro(false), 850)
    return () => window.clearTimeout(timeout)
  }, [showIntro])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [menuOpen])

  return (
    <>
      <AnimatePresence>{showIntro && <IntroCurtain />}</AnimatePresence>
      <motion.div className="page-progress" style={{ scaleX: progress }} />

      <motion.header className="site-header-v2" style={{ "--compact": headerCompact } as React.CSSProperties}>
        <a className="brand-v2" href="#accueil" aria-label="Safaya — accueil">
          <span className="brand-symbol">S</span>
          <span>SAFAYA<small>BOULANGERIE · PÂTISSERIE</small></span>
        </a>

        <AnimatedNav />

        <div className="header-actions">
          <div className={`open-status ${openState.open ? "is-open" : ""}`}><i />{openState.label}</div>
          <Button asChild variant="accent" size="sm"><a href="#venir">Nous trouver <ArrowUpRight /></a></Button>
        </div>

        <button className="menu-trigger" type="button" onClick={() => setMenuOpen(true)} aria-label="Ouvrir le menu"><Menu /></button>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div className="menu-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="menu-panel" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ duration: .6, ease: [.16, 1, .3, 1] }}>
              <div className="menu-top"><span>Menu</span><button onClick={() => setMenuOpen(false)} aria-label="Fermer le menu"><X /></button></div>
              <nav>{[
                ["01", "La maison", "#maison"],
                ["02", "Savoir-faire", "#savoir-faire"],
                ["03", "Le quartier", "#avis"],
                ["04", "Nous trouver", "#venir"],
              ].map(([number, label, href]) => <a key={href} href={href} onClick={() => setMenuOpen(false)}><small>{number}</small>{label}<ArrowUpRight /></a>)}</nav>
              <div className="menu-contact"><a href="tel:+33156057460"><Phone />01 56 05 74 60</a><span>7 place de la Gare des Vallées<br />92270 Bois-Colombes</span></div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main>
        <section className="hero-v2" id="accueil">
          <div className="hero-noise" />
          <div className="hero-line hero-line-a" /><div className="hero-line hero-line-b" />

          <motion.div className="hero-copy-v2" style={{ y: heroCopyY }}>
            <motion.div className="award-chip" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.02 }}>
              <Award />
              <span>Meilleur Artisan Boulanger<br /><strong>Hauts-de-Seine · 2024</strong></span>
            </motion.div>

            <h1>
              <span className="title-mask"><motion.i initial={{ y: "105%" }} animate={{ y: 0 }} transition={{ delay: .98, duration: .9, ease: [.16, 1, .3, 1] }}>Le matin</motion.i></span>
              <span className="title-mask"><motion.i initial={{ y: "105%" }} animate={{ y: 0 }} transition={{ delay: 1.08, duration: .9, ease: [.16, 1, .3, 1] }}>commence <em>ici.</em></motion.i></span>
            </h1>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.35 }}>
              À deux pas du quai, Safaya transforme chaque matin en rituel : du pain primé, un feuilletage précis et une équipe qui connaît son quartier.
            </motion.p>

            <motion.div className="hero-cta" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.45 }}>
              <Button asChild variant="accent" size="lg"><MagneticLink href="https://www.google.com/maps/search/?api=1&query=7+Place+de+la+Gare+des+Vallées+92270+Bois-Colombes" target="_blank" rel="noreferrer"><Navigation /> L’itinéraire</MagneticLink></Button>
              <a className="discover-link" href="#maison">Découvrir la maison <ArrowDown /></a>
            </motion.div>
          </motion.div>

          <motion.div className="hero-media" style={{ y: heroVisualY, scale: heroVisualScale }}>
            <motion.figure
              className="hero-media-main"
              initial={{ clipPath: "inset(100% 0 0 0)" }}
              animate={{ clipPath: "inset(0% 0 0 0)" }}
              transition={{ delay: .95, duration: 1.15, ease: [.76, 0, .24, 1] }}
            >
              <motion.img
                src="/images/hero-croissants.jpg"
                alt="Croissants dorés en vitrine"
                loading="eager"
                fetchPriority="high"
                initial={{ scale: 1.16 }}
                animate={{ scale: 1.04 }}
                transition={{ delay: .95, duration: 1.8, ease: [.16, 1, .3, 1] }}
              />
              <figcaption><span>La fournée du matin</span><small>Feuilletage · beurre · patience</small></figcaption>
            </motion.figure>
            <motion.figure className="hero-media-detail" initial={{ opacity: 0, x: 45, rotate: 4 }} animate={{ opacity: 1, x: 0, rotate: 0 }} transition={{ delay: 1.45, duration: .85, ease: [.16, 1, .3, 1] }}>
              <motion.img src="/images/croissant-coffee.jpg" alt="Croissant et café servis au petit-déjeuner" animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }} />
              <span>06:30<small>Le premier café</small></span>
            </motion.figure>
            <motion.div className="hero-media-line" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 1.65, duration: .8, ease: [.16, 1, .3, 1] }} />
            <motion.div className="floating-proof proof-rating" animate={{ y: [0, -7, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}><span>4,3</span><div><strong>★★★★★</strong><small>+130 avis</small></div></motion.div>
            <motion.div className="floating-proof proof-craft" animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 4.6, ease: "easeInOut" }}><Wheat /><span><strong>Artisan</strong><small>depuis 2019</small></span></motion.div>
          </motion.div>

          <div className="hero-bottom">
            <div><TrainFront /><span>Gare des Vallées<small>à 30 secondes</small></span></div>
            <div><Clock3 /><span>Mar. — Sam.<small>06:30 — 20:00</small></span></div>
            <div className="hero-address"><MapPin /><span>7 place de la Gare<small>Bois-Colombes</small></span></div>
            <span className="scroll-cue">Scroll <i /></span>
          </div>
        </section>

        <section className="statement" id="maison">
          <SectionLabel number="01">La maison</SectionLabel>
          <Reveal>
            <p className="statement-title">Une boulangerie de quartier.<br />Un niveau <em>départemental.</em></p>
          </Reveal>
          <div className="statement-grid">
            <Reveal className="statement-copy"><p>En 2024, Mohamed El Ouafi décroche le titre de Meilleur Artisan Boulanger des Hauts-de-Seine. La récompense d’une méthode simple : travailler juste, recommencer, progresser.</p><a href="#savoir-faire">Voir les pièces signatures <ArrowRight /></a></Reveal>
            <Reveal className="statement-quote" delay={.12}><Quote /><blockquote>« Le travail et la persévérance. »</blockquote><span>Mohamed El Ouafi · Artisan boulanger</span></Reveal>
            <Reveal className="statement-stats" delay={.2}><div><strong>01</strong><span>1er au concours<br />départemental</span></div><div><strong>05</strong><span>années au cœur<br />du quartier</span></div><div><strong>4,3</strong><span>sur Google<br />+130 avis</span></div></Reveal>
          </div>
        </section>

        <AtelierInterlude />

        <BakeryTimeline />

        <div className="chapter-ribbon" aria-hidden="true">
          <motion.i initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true, margin: "-10%" }} transition={{ duration: 1.1, ease: [.76, 0, .24, 1] }} />
          <span>MATIÈRE <b>·</b> TEMPS <b>·</b> GESTE</span>
        </div>

        <section className="craft" id="savoir-faire">
          <div className="craft-intro">
            <SectionLabel number="02" light>Le savoir-faire</SectionLabel>
            <Reveal><h2>Trois gestes.<br /><em>Une signature.</em></h2></Reveal>
            <Reveal><p>Passez d’une pièce à l’autre. Les images se composent comme une vitrine vivante et révèlent la matière, le geste et les détails.</p></Reveal>
          </div>

          <div className="craft-showcase">
            <div className="product-nav" role="tablist" aria-label="Choisir une spécialité">
              {products.map((product) => (
                <button key={product.id} type="button" role="tab" aria-selected={product.id === activeProduct} className={product.id === activeProduct ? "active" : ""} onClick={() => setActiveProduct(product.id)}>
                  <span>{product.number}</span>{product.short}<i />
                </button>
              ))}
            </div>

            <div className="showcase-stage">
              <AnimatePresence mode="wait">
                <motion.span className="stage-wordmark" key={`word-${active.id}`} initial={{ opacity: 0, x: 80 }} animate={{ opacity: .16, x: 0 }} exit={{ opacity: 0, x: -80 }} transition={{ duration: .75, ease: [.16, 1, .3, 1] }} aria-hidden="true">{active.short}</motion.span>
              </AnimatePresence>
              <AnimatePresence mode="wait">
                <motion.figure
                  key={activeProduct}
                  className="showcase-photo"
                  initial={{ clipPath: "inset(0 100% 0 0)" }}
                  animate={{ clipPath: "inset(0 0% 0 0)" }}
                  exit={{ clipPath: "inset(0 0 0 100%)" }}
                  transition={{ duration: .72, ease: [.76, 0, .24, 1] }}
                >
                  <motion.img src={active.image} alt={active.alt} loading="lazy" initial={{ scale: 1.15 }} animate={{ scale: 1.02 }} transition={{ duration: 1.2, ease: [.16, 1, .3, 1] }} />
                  <div className="showcase-shade" />
                  <figcaption><span>Safaya</span><small>Pièce signature · {active.number}</small></figcaption>
                </motion.figure>
              </AnimatePresence>
              <div className="stage-index">{active.number}<span>/ 03</span></div>
              <div className="stage-controls">
                <button type="button" onClick={() => changeProduct(-1)} aria-label="Voir la spécialité précédente"><ArrowLeft /></button>
                <button type="button" onClick={() => changeProduct(1)} aria-label="Voir la spécialité suivante"><ArrowRight /></button>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div className="product-story" key={active.id} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: .4 }}>
                <div className="story-proof"><Star fill="currentColor" />{active.proof}</div>
                <h3>{active.title}</h3>
                <p>{active.description}</p>
                <div className="story-note">{active.note}</div>
              </motion.div>
            </AnimatePresence>
          </div>
        </section>

        <section className="award-section">
          <motion.figure className="award-photo" initial={{ clipPath: "inset(0 0 100% 0)" }} whileInView={{ clipPath: "inset(0 0 0% 0)" }} viewport={{ once: true, margin: "-15%" }} transition={{ duration: 1.05, ease: [.76, 0, .24, 1] }}>
            <motion.img src="/images/croissants-oven.jpg" alt="Croissants cuisant dans un four" loading="lazy" initial={{ scale: 1.14 }} whileInView={{ scale: 1.02 }} viewport={{ once: true }} transition={{ duration: 1.5, ease: [.16, 1, .3, 1] }} />
            <figcaption><span>240°</span><small>La chaleur juste.<br />Le temps précis.</small></figcaption>
          </motion.figure>
          <motion.div className="award-watermark" whileInView={{ x: ["-8%", "0%"] }} viewport={{ once: true }} transition={{ duration: 1.2 }}>PREMIER</motion.div>
          <div className="award-content">
            <SectionLabel number="03" light>Le titre 2024</SectionLabel>
            <Reveal><h2>Quatre essais.<br />Une première place.</h2></Reveal>
            <Reveal><p>La meilleure note au pain de campagne, et un classement dans le top 10 pour le croissant et la baguette tradition.</p></Reveal>
            <Reveal className="award-podium">
              <div><span>1</span><strong>Pain de campagne</strong><small>Meilleure note</small></div>
              <div><span>10</span><strong>Croissant</strong><small>Top départemental</small></div>
              <div><span>10</span><strong>Tradition</strong><small>Top départemental</small></div>
            </Reveal>
          </div>
          <motion.div className="award-seal" whileInView={{ rotate: [12, 0], scale: [.8, 1], opacity: [0, 1] }} viewport={{ once: true }} transition={{ duration: .9, ease: [.16, 1, .3, 1] }}><Award /><span>MEILLEUR<br />ARTISAN<br /><strong>92</strong></span><small>2024</small></motion.div>
        </section>

        <div className="kinetic-line" aria-hidden="true">
          <div className="kinetic-track kinetic-forward">{[0, 1].map((group) => <span key={group}>PÉTRI SUR PLACE&nbsp; ✦ &nbsp;FAÇONNÉ À LA MAIN&nbsp; ✦ &nbsp;CUIT CHAQUE MATIN&nbsp; ✦ &nbsp;</span>)}</div>
          <div className="kinetic-track kinetic-backward">{[0, 1].map((group) => <span key={group}>ÇA CROUSTILLE&nbsp; · &nbsp;ÇA FEUILLETTE&nbsp; · &nbsp;ÇA SE PARTAGE&nbsp; · &nbsp;</span>)}</div>
        </div>

        <section className="reviews" id="avis">
          <div className="reviews-heading">
            <SectionLabel number="04">Le quartier</SectionLabel>
            <Reveal><h2>La preuve par<br /><em>les habitués.</em></h2></Reveal>
            <Reveal className="reviews-score"><strong>4,3</strong><div><span>★★★★★</span><p>Une adresse appréciée<br />à Bois-Colombes</p></div></Reveal>
          </div>
          <div className="review-grid">
            {reviews.map((review, index) => (
              <Reveal key={review.author} delay={index * .08}>
                <motion.article whileHover={{ y: -10 }} transition={{ duration: .3 }}>
                  <div className="review-top"><Quote /><span>0{index + 1}</span></div>
                  <p>{review.quote}</p>
                  <footer><span>{review.author}</span><small>{review.source}</small></footer>
                </motion.article>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="visit-v2" id="venir">
          <div className="visit-copy">
            <SectionLabel number="05" light>Venir chez Safaya</SectionLabel>
            <Reveal><h2>À la sortie<br />du train.</h2></Reveal>
            <Reveal><a className="visit-address" href="https://www.google.com/maps/search/?api=1&query=7+Place+de+la+Gare+des+Vallées+92270+Bois-Colombes" target="_blank" rel="noreferrer">7 place de la Gare des Vallées<br />92270 Bois-Colombes <ArrowUpRight /></a></Reveal>
            <Reveal className="hours-v2">
              <div><span>Mardi — Samedi</span><strong>06:30 — 20:00</strong></div>
              <div><span>Dimanche</span><strong>07:00 — 19:00</strong></div>
              <div className="closed"><span>Lundi</span><strong>Fermé</strong></div>
            </Reveal>
            <Reveal className="visit-actions"><Button asChild variant="accent" size="lg"><MagneticLink href="tel:+33156057460"><Phone />01 56 05 74 60</MagneticLink></Button><a href="https://www.google.com/maps/search/?api=1&query=7+Place+de+la+Gare+des+Vallées+92270+Bois-Colombes" target="_blank" rel="noreferrer">Ouvrir dans Maps <ArrowUpRight /></a></Reveal>
          </div>

          <div className="map-v2" aria-label="Plan stylisé de la Gare des Vallées">
            <div className="map-grid-v2" />
            <div className="rail rail-one" /><div className="rail rail-two" />
            <div className="station-pill"><TrainFront /><span>Les Vallées<small>Ligne J</small></span></div>
            <motion.div className="safaya-pin" animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}><span>S</span><div><strong>Safaya</strong><small>30 sec. à pied</small></div></motion.div>
            <div className="map-route"><i /><span>VOUS ÊTES ARRIVÉ</span></div>
          </div>
        </section>
      </main>

      <footer id="footer" className="footer-v2">
        <motion.figure className="footer-visual">
          <motion.img src="/images/croissants-dark.jpg" alt="Croissants dorés sur fond sombre" loading="lazy" whileInView={{ scale: [1.12, 1] }} viewport={{ once: true }} transition={{ duration: 1.6, ease: [.16, 1, .3, 1] }} />
          <figcaption><span>À demain matin.</span><small>Première fournée · 06:30</small></figcaption>
        </motion.figure>
        <div className="footer-main"><span className="footer-logo">SAFAYA<em>•</em></span><p>Le bon pain.<br />Au bon endroit.<br />Chaque matin.</p></div>
        <div className="footer-meta"><span>© 2026 Safaya</span><span>Boulangerie · Pâtisserie · Salon de thé · Photos Pexels</span><a href="#accueil">Retour en haut <ArrowUpRight /></a></div>
      </footer>

      <div className="mobile-quick-actions"><a href="tel:+33156057460"><Phone />Appeler</a><a href="https://www.google.com/maps/search/?api=1&query=7+Place+de+la+Gare+des+Vallées+92270+Bois-Colombes" target="_blank" rel="noreferrer"><Navigation />Itinéraire</a></div>
    </>
  )
}

export default App
