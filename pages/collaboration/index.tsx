import { useEffect, useState } from 'react'
import { client } from '@/lib/sanity'
import { groq } from 'next-sanity'
import Header from '@/components/Header'
import SectionPosterCard from '@/components/SectionPosterCard'

type Collaboration = {
  _id: string
  slug: { current: string }
  title: string
  banner?: any
}

const query = groq`
  *[_type == "collaboration" && !(_id in path("drafts.**"))] | order(annee desc) {
    _id,
    title,
    slug,
    banner
  }
`

export default function CollaborationIndexPage() {
  const [collaborations, setCollaborations] = useState<Collaboration[]>([])

  useEffect(() => {
    client.fetch(query).then((data) => setCollaborations(data))
  }, [])

  return (
    <div className="bg-white">
      <Header dark={false} />

      <main className="pt-32 pb-12">
        <h1 className="text-4xl font-clash md:text-6xl font-semibold mb-8 text-center">
          Collaborations
        </h1>

        <div className="px-4 lg:px-0">
          <div className="w-full max-w-screen-xl mx-auto items-center">
            <div className="flex flex-wrap gap-6 justify-center lg:justify-start">
              {collaborations.map((item) => (
                <SectionPosterCard
                  key={item._id}
                  title={item.title}
                  slug={item.slug.current}
                  banner={item.banner}
                  basePath="collaboration"
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
