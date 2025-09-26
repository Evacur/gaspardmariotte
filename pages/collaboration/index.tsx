import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
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
  const router = useRouter()
  const [collaborations, setCollaborations] = useState<Collaboration[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    client.fetch(query)
      .then((data) => {
        setCollaborations(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setError('Erreur lors du chargement des collaborations.')
        setLoading(false)
      })
  }, [])

  if (loading) {
    return <div className="text-center mt-20">Chargement...</div>
  }

  if (error) {
    return <div className="text-center mt-20 text-red-600">{error}</div>
  }

  return (
    <div className="bg-white">
      <Header dark={false} />

      <main className="pt-32 pb-12">
        <h1 className="text-4xl font-clash md:text-6xl font-semibold mb-8 text-center">
          Collaborations
        </h1>

        {/* Container responsive */}
        <div className="px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {collaborations.map((item, index) => (
              <div
                key={item._id}
                className="w-full h-[300px]"
              >
                <SectionPosterCard
                  title={item.title}
                  slug={item.slug.current}
                  banner={item.banner}
                  basePath="collaboration"
                />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}