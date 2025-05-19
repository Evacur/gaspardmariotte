import { useEffect, useState } from "react"
import { client } from "@/lib/sanity"
import { groq } from "next-sanity"
import Header from "@/components/Header"
import WavyCreationCard from "@/components/WavyCreationCard"

type Section = {
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
  const [sections, setSections] = useState<Section[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await client.fetch<Section[]>(query)
        setSections(data)
      } catch (error) {
        console.error("Erreur fetch sanity:", error)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="bg-white">
      <Header dark={false} />
      <main className="px-6 pt-14 pb-4 lg:pt-24 lg:py-16 max-w-[1440px] mx-auto">
        <div className="space-y-8 lg:space-y-32 sm:space-y-6 items-center">
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
        </div>
      </main>
    </div>
  )
}
