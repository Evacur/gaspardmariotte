import { useEffect, useState } from "react"
import { client } from "@/lib/sanity"
import { groq } from "next-sanity"
import Header from "@/components/Header"
import WavyCreationCard from "@/components/WavyCreationCard"

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
  const [sections, setSections] = useState([])

  useEffect(() => {
    client.fetch(query).then(setSections)
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
