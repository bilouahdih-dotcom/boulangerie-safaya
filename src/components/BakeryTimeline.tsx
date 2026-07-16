import { useRef } from "react"
import { motion, useScroll, useTransform, type MotionValue } from "motion/react"

const timelineScenes = [
  {
    time: "03:45",
    eyebrow: "Le pétrissage",
    title: "La ville dort. La pâte, déjà, travaille.",
    description: "Farine, eau, levain et précision. Le premier geste donne le rythme à toute la journée.",
    image: "/images/baker-hands.jpg",
  },
  {
    time: "04:30",
    eyebrow: "Le façonnage",
    title: "Chaque pièce prend sa forme. Aucune ne se ressemble tout à fait.",
    description: "La main ajuste, replie et tend la pâte. Un geste répété, jamais automatique.",
    image: "/images/artisan-bread.jpg",
  },
  {
    time: "05:45",
    eyebrow: "La cuisson",
    title: "Le four décide de la couleur, du son et de la croûte.",
    description: "À 240 degrés, quelques secondes séparent le doré juste du doré de trop.",
    image: "/images/croissants-oven.jpg",
  },
  {
    time: "06:30",
    eyebrow: "L’ouverture",
    title: "Les portes s’ouvrent. Le quartier peut commencer sa journée.",
    description: "La première fournée rejoint la vitrine au moment où le premier train entre en gare.",
    image: "/images/bakery-croissants.jpg",
  },
] as const

type SceneProps = {
  index: number
  progress: MotionValue<number>
}

function useSceneMotion(index: number, progress: MotionValue<number>) {
  const lastIndex = timelineScenes.length - 1
  const segment = 1 / timelineScenes.length
  const start = index * segment
  const end = (index + 1) * segment

  const opacity = useTransform(
    progress,
    index === 0
      ? [0, end - 0.035, end + 0.035]
      : index === lastIndex
        ? [start - 0.035, start + 0.035, 1]
        : [start - 0.035, start + 0.035, end - 0.035, end + 0.035],
    index === 0 ? [1, 1, 0] : index === lastIndex ? [0, 1, 1] : [0, 1, 1, 0],
  )
  const scale = useTransform(progress, [start, Math.min(1, end + 0.04)], [1.12, 1])
  const y = useTransform(
    progress,
    index === 0
      ? [0, end - 0.035, end + 0.035]
      : index === lastIndex
        ? [start - 0.035, start + 0.035, 1]
        : [start - 0.035, start + 0.035, end - 0.035, end + 0.035],
    index === 0 ? [0, 0, -70] : index === lastIndex ? [70, 0, 0] : [70, 0, 0, -70],
  )

  return { opacity, scale, y }
}

function TimelineImage({ index, progress }: SceneProps) {
  const scene = timelineScenes[index]
  const { opacity, scale } = useSceneMotion(index, progress)

  return (
    <motion.figure className="timeline-image" style={{ opacity }} aria-hidden="true">
      <motion.img src={scene.image} alt="" loading="lazy" style={{ scale }} />
    </motion.figure>
  )
}

function TimelineCopy({ index, progress }: SceneProps) {
  const scene = timelineScenes[index]
  const { opacity, y } = useSceneMotion(index, progress)

  return (
    <motion.article className="timeline-copy" style={{ opacity, y }}>
      <span className="timeline-eyebrow">{scene.eyebrow}</span>
      <strong className="timeline-time">{scene.time}</strong>
      <h2>{scene.title}</h2>
      <p>{scene.description}</p>
    </motion.article>
  )
}

export function BakeryTimeline() {
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
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
            {timelineScenes.map((scene, index) => (
              <TimelineCopy key={scene.time} index={index} progress={scrollYProgress} />
            ))}
          </div>
          <div className="timeline-navigation" aria-hidden="true">
            <motion.i className="timeline-progress" style={{ scaleY: scrollYProgress }} />
            {timelineScenes.map((scene, index) => <span key={scene.time}>0{index + 1}<small>{scene.time}</small></span>)}
          </div>
        </div>
      </div>
    </section>
  )
}
