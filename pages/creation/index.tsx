import { useEffect, useState } from "react"
import { client } from "@/lib/sanity"
import { groq } from "next-sanity"
import Header from "@/components/Header"
import WavyCreationCard from "@/components/WavyCreationCard"

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
  const [isMobile, setIsMobile] = useState(false)

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

  useEffect(() => {
  const checkIsMobile = () => {
    setIsMobile(window.innerWidth < 600) 
  }

  checkIsMobile()
  window.addEventListener("resize", checkIsMobile)

  return () => {
    window.removeEventListener("resize", checkIsMobile)
  }
}, [])


  return (
    <div className="bg-white h-screen">
      <Header dark={!isMobile} className="fixed top-0 left-0 w-full z-30" />
      <main className="pt-16 lg:snap-y lg:snap-mandatory lg:overflow-y-scroll h-screen">
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
