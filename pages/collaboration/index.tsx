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
  *[_type == "collaboration"] | order(annee desc) {
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
      <main className="px-4 pt-32 pb-12">
        <h1 className="text-4xl md:text-6xl font-bold mb-12 text-center">Collaborations</h1>

        <div className="flex justify-center">
          <div className="flex flex-wrap gap-4 w-full max-w-screen-xl">
            {collaborations.map((item) => (
              <SectionPosterCard
                key={item._id}
                title={item.title}
                slug={item.slug.current}
                banner={item.banner}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
