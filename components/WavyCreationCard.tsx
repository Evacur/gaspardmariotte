import React, { useRef, useEffect, useState } from "react"
import Link from "next/link"
import { urlFor } from "@/lib/sanity"
import { motion } from "framer-motion"

export type CreationSection = {
  _id: string
  slug: { current: string }
  title: string
  description: string
  image?: any
  order?: number
}

type Props = {
  section: CreationSection
  index: number
  total: number
  filterStrength?: number
  glitchEdges?: boolean
}

export default function WavyCreationCard({
  section,
  index,
  total,
  filterStrength = 1,
  glitchEdges = false,
}: Props) {
  const imageUrl = section.image
    ? urlFor(section.image).width(340).height(430).fit("crop").url()
    : null
  const imageMobileUrl = section.image
    ? urlFor(section.image).width(800).height(800).fit("crop").url()
    : null

  // On génère DEUX ids de filtre, pour alterner
  const filterIdA = useRef(`wavy-filter-a-${Math.random().toString(36).substr(2, 9)}`).current
  const filterIdB = useRef(`wavy-filter-b-${Math.random().toString(36).substr(2, 9)}`).current

  // Permet de switcher le filterId appliqué sur l'image (A ou B)
  const [activeFilter, setActiveFilter] = useState<'A' | 'B'>('A')

  // Références vers les turbulences/displacements
  const turbulenceA = useRef<SVGFETurbulenceElement | null>(null)
  const displacementA = useRef<SVGFEDisplacementMapElement | null>(null)
  const turbulenceB = useRef<SVGFETurbulenceElement | null>(null)
  const displacementB = useRef<SVGFEDisplacementMapElement | null>(null)

  // Ajout des deux SVG filters
  useEffect(() => {
    const addFilter = (id: string, numOctaves: number, scale: number) => {
      if (!document.getElementById(id)) {
        const svg = document.createElement("div")
        svg.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" style="position:absolute;width:0;height:0;">
            <filter id="${id}" x="-30%" y="-30%" width="160%" height="160%" primitiveUnits="userSpaceOnUse">
              <feTurbulence
                type="turbulence"
                baseFrequency="0.008 0.01"
                numOctaves="${numOctaves}"
                result="turbulence"
                seed="2"
              />
              <feGaussianBlur in="turbulence" stdDeviation="0.7" result="blurredTurbulence" />
              <feDisplacementMap
                in2="blurredTurbulence"
                in="SourceGraphic"
                scale="${scale}"
                xChannelSelector="R"
                yChannelSelector="G"
                result="displaced"
              />
              <feMorphology in="SourceAlpha" operator="dilate" radius="2" result="dilatedAlpha"/>
              <feComposite in="displaced" in2="dilatedAlpha" operator="in" />
            </filter>
          </svg>
        `
        document.body.appendChild(svg)
      }
    }
    addFilter(filterIdA, glitchEdges ? 3 : 2, filterStrength * 8)
    addFilter(filterIdB, glitchEdges ? 3 : 2, filterStrength * 8)
  }, [filterIdA, filterIdB, glitchEdges, filterStrength])

  // Animation, pour chaque filtre
  useEffect(() => {
    turbulenceA.current = document.querySelector(
      `#${filterIdA} feTurbulence`
    ) as SVGFETurbulenceElement | null
    displacementA.current = document.querySelector(
      `#${filterIdA} feDisplacementMap`
    ) as SVGFEDisplacementMapElement | null

    turbulenceB.current = document.querySelector(
      `#${filterIdB} feTurbulence`
    ) as SVGFETurbulenceElement | null
    displacementB.current = document.querySelector(
      `#${filterIdB} feDisplacementMap`
    ) as SVGFEDisplacementMapElement | null

    let animationFrameId: number
    let time = 0
    let seedA = 2
    let seedB = 4

    // Switch le filtre appliqué à l'image toutes les 7s (ajustable)
    const SWITCH_INTERVAL = 7 // en secondes
    let lastSwitch = 0

    const animate = () => {
      time += 0.004

      // Anime le filtre A
      if (turbulenceA.current) {
        const freqX = 0.005 + 0.015 * Math.sin(time)
        const freqY = 0.01 + 0.006 * Math.cos(time * 4.1)
        turbulenceA.current.setAttribute("baseFrequency", `${freqX} ${freqY}`)
        // Change seed aussi pour anti-freeze
        if (Math.floor(time * 60) % 150 === 0) {
          seedA = (seedA + 1) % 9999
          turbulenceA.current.setAttribute("seed", seedA.toString())
        }
      }
      if (displacementA.current) {
        const scale = filterStrength * (4 + 6 * Math.sin(time * 1.10))
        displacementA.current.setAttribute("scale", scale.toFixed(2))
      }

      // Anime le filtre B
      if (turbulenceB.current) {
        const freqX = 0.008 + 0.018 * Math.cos(time * 1.3)
        const freqY = 0.012 + 0.005 * Math.sin(time * 2.4)
        turbulenceB.current.setAttribute("baseFrequency", `${freqX} ${freqY}`)
        // Change seed aussi
        if (Math.floor(time * 60) % 180 === 0) {
          seedB = (seedB + 1) % 9999
          turbulenceB.current.setAttribute("seed", seedB.toString())
        }
      }
      if (displacementB.current) {
        const scale = filterStrength * (4 + 6 * Math.cos(time * 1.22))
        displacementB.current.setAttribute("scale", scale.toFixed(2))
      }

      // Switch de filtre toutes les SWITCH_INTERVAL secondes
      if (time - lastSwitch > SWITCH_INTERVAL) {
        setActiveFilter(f => (f === 'A' ? 'B' : 'A'))
        lastSwitch = time
      }

      animationFrameId = requestAnimationFrame(animate)
    }
    animationFrameId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [filterIdA, filterIdB, filterStrength, glitchEdges])

  // Animated Letters (inchangé)
  function AnimatedLetters({ text }: { text: string }) {
    return (
      <span className="inline-block">
        {text.split("").map((char, i) => (
          <motion.span
            key={i}
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 220,
              damping: 30,
              mass: 1,
            }}
            viewport={{ once: true, amount: 0.7 }}
            className="inline-block"
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </span>
    );
  }

  // Utilisation du filtre dynamique !
  const currentFilterId = activeFilter === 'A' ? filterIdA : filterIdB

  return (
    <Link
      key={section._id}
      href={`/creation/${section.slug.current}`}
      className="block group w-full"
    >
      {/* DESKTOP + TABLET */}
      <div className="hidden md:flex flex-col items-center justify-center h-screen w-full snap-start">
        <div className="flex flex-col items-center gap-0">
          <span className="text-[14px] font-medium mb-0 text-black opacity-80 hidden sm:inline">
            {index + 1}/{total}
          </span>
          <h2 className="text-[48px] font-bold font-clash leading-tight text-black text-center">
            <AnimatedLetters text={section.title} />
          </h2>
          <p className="text-[16px] font-normal text-black opacity-80 text-center mt-0 hidden sm:block">
            {section.description}
          </p>
        </div>
        <div className="pt-4" style={{ marginTop: 16 }}>
          {imageUrl && (
            <div className="w-[340px] h-[430px] flex items-center justify-center rounded-[2px] overflow-hidden">
              <img
                src={imageUrl}
                alt={section.title}
                className="w-full h-full object-cover"
                style={{
                  filter: `url(#${currentFilterId})`,
                }}
              />
            </div>
          )}
        </div>
      </div>
      {/* MOBILE */}
      <div className="md:hidden w-full px-4 mb-4">
        <div className="relative h-[400px] w-full overflow-hidden rounded-[2px]">
          {imageMobileUrl && (
            <img
              src={imageMobileUrl}
              alt={section.title}
              className="w-full h-full object-cover absolute inset-0"
              style={{
                filter: `url(#${currentFilterId})`,
              }}
            />
          )}
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors duration-300 z-10" />
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white text-center px-6">
            <h2 className="text-4xl font-clash font-semibold leading-tight mb-2 relative">
              <span className="relative z-10">{section.title}</span>
            </h2>
          </div>
        </div>
      </div>
    </Link>
  )
}
