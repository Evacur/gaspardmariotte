import { useEffect, useState } from "react"
import { client } from "@/lib/sanity"
import { groq } from "next-sanity"
import Header from "@/components/Header"
import WavyCreationCard from "@/components/WavyCreationCard"

// Type qui correspond exactement à ton schéma Sanity creationSection
export type CreationSection = {
  _id: string
  slug: { current: string }
  title: string
  description: string
  image?: any
  order?: number
}

const query = groq`
  *[_type == "creationSection"] | order(order asc) {
    _id,
    slug,
    title,
    description,
    image,
    order
  }
`

export default function CreationMenuPage() {
  const [sections, setSections] = useState<CreationSection[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await client.fetch<CreationSection[]>(query)
        setSections(data)
      } catch (error) {
        console.error("Erreur fetch sanity:", error)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="bg-white h-screen">
      <Header dark={false} />
      {/* Scroll snapping en desktop, empilement sur mobile */}
      <main className="lg:snap-y lg:snap-mandatory lg:overflow-y-scroll h-screen">
        {sections.map((section, index) => (
          <WavyCreationCard
            key={section._id}
            section={section}
            index={index}
            total={sections.length}
            filterStrength={1}
            glitchEdges={false}
          />
        ))}
      </main>
    </div>
  )
}
