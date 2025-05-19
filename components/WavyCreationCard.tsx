import React, { useRef, useEffect } from "react"
import Link from "next/link"
import { urlFor } from "@/lib/sanity"

type Section = {
  _id: string
  slug: { current: string }
  title: string
  description: string
  image?: any
}

type Props = {
  section: Section
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
    ? urlFor(section.image).width(395).height(490).fit("crop").url()
    : null
  const imageMobileUrl = section.image
    ? urlFor(section.image).width(800).height(800).fit("crop").url()
    : null

  const filterId = useRef(
    `wavy-filter-${Math.random().toString(36).substr(2, 9)}`
  ).current

  const turbulence = useRef<SVGFETurbulenceElement | null>(null)
  const displacement = useRef<SVGFEDisplacementMapElement | null>(null)

  useEffect(() => {
    if (!document.getElementById(filterId)) {
      const svg = document.createElement("div")
      svg.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" style="position:absolute;width:0;height:0;">
          <filter id="${filterId}" x="-30%" y="-30%" width="160%" height="160%" primitiveUnits="userSpaceOnUse">
            <feTurbulence
              type="turbulence"
              baseFrequency="0.008 0.01"
              numOctaves="${glitchEdges ? 3 : 2}"
              result="turbulence"
              seed="2"
            />
<feGaussianBlur in="turbulence" stdDeviation="0.7" result="blurredTurbulence" />
            <feDisplacementMap
              in2="blurredTurbulence"
              in="SourceGraphic"
              scale="${filterStrength * 8}"
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

    turbulence.current = document.querySelector(`#${filterId} feTurbulence`)
    displacement.current = document.querySelector(`#${filterId} feDisplacementMap`)

    let animationFrameId: number
    let time = 0

    const animate = () => {
      time += 0.01

      if (turbulence.current) {
        const freqX = 0.008 + 0.005 * Math.sin(time)
        const freqY = 0.01 + 0.005 * Math.cos(time * 1.1)
        turbulence.current.setAttribute("baseFrequency", `${freqX} ${freqY}`)
      }

      if (displacement.current) {
        const scale = filterStrength * (8 + 1 * Math.sin(time * 1.3))
        displacement.current.setAttribute("scale", scale.toFixed(2))
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    animationFrameId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [filterId, glitchEdges, filterStrength])

  return (
    <Link
      key={section._id}
      href={`/creation/${section.slug.current}`}
      className="block group"
    >
      {/* Desktop */}
      <div className="hidden lg:flex items-center justify-between h-[490px]">
        {/* Texte à gauche */}
        <div className="flex flex-col justify-center max-w-xl">
          <span className="text-sm font-medium mb-2">
            {index + 1}/{total}
          </span>
          <h2 className="text-6xl font-clash font-semibold leading-none mb-4">
            {section.title}
          </h2>
          <p className="text-black text-base font-medium font-satoshi">
            {section.description}
          </p>
        </div>

        {/* Image à droite */}
        {imageUrl && (
          <div
            className="w-[395px] h-[490px] rotate-[2deg] origin-center rounded-sm overflow-hidden"
            style={{ display: "flex", overflow: "hidden" }}
          >
            <img
              src={imageUrl}
              alt={section.title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
                filter: `url(#${filterId})`,
              }}
            />
          </div>
        )}
      </div>

      {/* Mobile */}
      <div className="relative h-[400px] flex lg:hidden overflow-hidden rounded-[2px]">
        {/* Image de fond */}
        {imageMobileUrl && (
          <div className="w-full h-full">
            <img
              src={imageMobileUrl}
              alt={section.title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
                filter: `url(#${filterId})`,
              }}
            />
          </div>
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors duration-300 z-10" />

        {/* Texte centré */}
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white text-center px-6">
          <h2 className="text-4xl font-clash font-semibold leading-tight mb-2">
            {section.title}
          </h2>
        </div>
      </div>
    </Link>
  )
}
