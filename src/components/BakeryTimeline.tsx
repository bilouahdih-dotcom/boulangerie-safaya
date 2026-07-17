import { useRef, useState } from "react"
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "motion/react"

const timelineScenes = [
  {
    time: "03:45",
    eyebrow: "Le pétrissage",
    title: "La ville dort. La pâte, déjà, travaille.",
    description: "Farine, eau, levain et précision. Le premier geste donne le rythme à toute la journée.",
    image: "/images/baker-hands.webp",
    width: 1800,
    height: 2239,
  },
  {
    time: "04:30",
    eyebrow: "Le façonnage",
    title: "Chaque pièce prend sa forme. Aucune ne se ressemble tout à fait.",
    description: "La main ajuste, replie et tend la pâte. Un geste répété, jamais automatique.",
    image: "/images/artisan-bread.webp",
    width: 1600,
    height: 1067,
  },
  {
    time: "05:45",
    eyebrow: "La cuisson",
    title: "Le four décide de la couleur, du son et de la croûte.",
    description: "À 240 degrés, quelques secondes séparent le doré juste du doré de trop.",
    image: "/images/croissants-oven.webp",
    width: 1800,
    height: 2700,
  },
  {
    time: "06:30",
    eyebrow: "L’ouverture",
    title: "Les portes s’ouvrent. Le quartier peut commencer sa journée.",
    description: "La première fournée rejoint la vitrine au moment où le premier train entre en gare.",
    image: "/images/bakery-croissants.webp",
    width: 1600,
    height: 2399,
  },
] as const

type SceneProps = {
  index: number
  progress: MotionValue<number>
}

function useImageMotion(index: number, progress: MotionValue<number>) {
  const lastIndex = timelineScenes.length - 1
  const segment = 1 / timelineScenes.length
  const start = index * segment
  const end = (index + 1) * segment

  const imageOpacity = useTransform(
    progress,
    index === 0
      ? [0, end - 0.035, end + 0.035]
      : index === lastIndex
        ? [start - 0.035, start + 0.035, 1]
        : [start - 0.035, start + 0.035, end - 0.035, end + 0.035],
    index === 0 ? [1, 1, 0] : index === lastIndex ? [0, 1, 1] : [0, 1, 1, 0],
  )
  const scale = useTransform(progress, [start, Math.min(1, end + 0.04)], [1.12, 1])

  return { imageOpacity, scale }
}

function TimelineImage({ index, progress }: SceneProps) {
  const scene = timelineScenes[index]
  const { imageOpacity, scale } = useImageMotion(index, progress)

  return (
    <motion.figure className="timeline-image" style={{ opacity: imageOpacity }} aria-hidden="true">
      <motion.img src={scene.image} alt="" width={scene.width} height={scene.height} loading="lazy" decoding="async" style={{ scale }} />
    </motion.figure>
  )
}

export function BakeryTimeline() {
  const sectionRef = useRef<HTMLElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  })
  const activeScene = timelineScenes[activeIndex]

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setActiveIndex(Math.min(timelineScenes.length - 1, Math.floor(latest * timelineScenes.length)))
  })

  return (
    <section className="timeline-shell" id="fournil" ref={sectionRef} aria-label="Une matinée dans le fournil Safaya">
      <div className="timeline-sticky">
        <div className="timeline-media">
          {timelineScenes.map((scene, index) => (
            <TimelineImage key={scene.time} index={index} progress={scrollYProgress} />
          ))}
          <div className="timeline-shade" />
          <span className="timeline-watermark">SAFAYA</span>
        </div>

        <div className="timeline-content">
          <div className="timeline-heading"><span>Une matinée au fournil</span><small>Du premier geste à la première vente</small></div>
          <div className="timeline-copy-stack">
            <AnimatePresence mode="wait" initial={false}>
              <motion.article
                className="timeline-copy"
                key={activeScene.time}
                initial={{ opacity: 0, y: 46 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -46 }}
                transition={{ duration: .32, ease: [.76, 0, .24, 1] }}
              >
                <span className="timeline-eyebrow">{activeScene.eyebrow}</span>
                <strong className="timeline-time">{activeScene.time}</strong>
                <h2>{activeScene.title}</h2>
                <p>{activeScene.description}</p>
              </motion.article>
            </AnimatePresence>
          </div>
          <div className="timeline-navigation" aria-hidden="true">
            <motion.i className="timeline-progress" style={{ scaleX: scrollYProgress }} />
            {timelineScenes.map((scene, index) => <span key={scene.time}>0{index + 1}<small>{scene.time}</small></span>)}
          </div>
        </div>
      </div>
    </section>
  )
}
