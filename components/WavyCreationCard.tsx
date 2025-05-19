import React, { useRef, useState, useEffect } from "react"
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

export function WavyImage({
  image,
  filterStrength = 1,
  glitchEdges = false,
}: {
  image: string
  filterStrength?: number
  glitchEdges?: boolean
}) {
  const imgRef = useRef<HTMLImageElement>(null)
  const filterId = useRef(
    `wavy-filter-${Math.random().toString(36).substr(2, 9)}`
  ).current

  const [isHovered, setIsHovered] = useState(false)

  const currentScale = useRef(0)
  const targetScale = useRef(0)

  useEffect(() => {
    if (!document.getElementById(filterId)) {
      const svg = document.createElement("div")
      svg.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" style="position:absolute;width:0;height:0;">
          <filter id="${filterId}" x="-30%" y="-30%" width="160%" height="160%">
            <feTurbulence type="turbulence" baseFrequency="0.0015 0.0015" numOctaves="${
              glitchEdges ? 3 : 1
            }" result="turbulence"/>
            <feDisplacementMap in2="turbulence" in="SourceGraphic" scale="0" xChannelSelector="R" yChannelSelector="G"/>
          </filter>
        </svg>
      `
      document.body.appendChild(svg)
    }

    const turbulence = document.querySelector(`#${filterId} feTurbulence`)
    const displacement = document.querySelector(`#${filterId} feDisplacementMap`)

    const update = () => {
      const diff = targetScale.current - currentScale.current
      currentScale.current += diff * 0.08

      if (displacement) {
        displacement.setAttribute("scale", currentScale.current.toFixed(2))
      }

      requestAnimationFrame(update)
    }

    requestAnimationFrame(update)

    const handleMouseMove = (e: MouseEvent) => {
      if (!imgRef.current || !turbulence) return
      const rect = imgRef.current.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width
      const y = (e.clientY - rect.top) / rect.height
      const freqX = 0.002 + x * 0.005
      const freqY = 0.002 + y * 0.005
      turbulence.setAttribute("baseFrequency", `${freqX} ${freqY}`)
    }

    const el = imgRef.current
    if (el) {
      el.addEventListener("mousemove", handleMouseMove)
    }

    return () => {
      if (el) {
        el.removeEventListener("mousemove", handleMouseMove)
      }
    }
  }, [filterId, glitchEdges])

  useEffect(() => {
    targetScale.current = isHovered ? filterStrength * (glitchEdges ? 20 : 10) : 0
  }, [isHovered, filterStrength, glitchEdges])

  return (
    // Applique les contraintes ici
    <div className="w-[395px] h-[490px] rotate-[2deg] origin-center rounded-sm overflow-hidden">
      <div
        style={{
          width: "100%",
          height: "100%",
          overflow: "hidden",
          borderRadius: 2,
          display: "flex",
        }}
      >
        <img
          ref={imgRef}
          src={image}
          alt="Wavy"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            filter: `url(#${filterId})`,
          }}
        />
      </div>
    </div>
  )
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

  return (
    <Link key={section._id} href={`/creation/${section.slug.current}`} className="block group">
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
          <p className="text-black text-base font-medium font-satoshi">{section.description}</p>
        </div>

        {/* Image à droite */}
        {imageUrl && (
          <WavyImage
            image={imageUrl}
            filterStrength={filterStrength}
            glitchEdges={glitchEdges}
          />
        )}
      </div>

      {/* Mobile */}
      <div className="relative h-[400px] flex lg:hidden overflow-hidden rounded-[2px]">
        {/* Image de fond */}
        {imageMobileUrl && (
          <div className="w-full h-full">
            <WavyImage
              image={imageMobileUrl}
              filterStrength={filterStrength}
              glitchEdges={glitchEdges}
            />
          </div>
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors duration-300 z-10" />

        {/* Texte centré */}
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white text-center px-6">
          <h2 className="text-4xl font-clash font-semibold leading-tight mb-2">{section.title}</h2>
        </div>
      </div>
    </Link>
  )
}
