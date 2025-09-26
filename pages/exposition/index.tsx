import { useEffect, useState } from 'react'
import { client } from '@/lib/sanity'
import { groq } from 'next-sanity'
import Header from '@/components/Header'
import SectionPosterCard from '@/components/SectionPosterCard'

type Exposition = {
  _id: string
  slug: { current: string }
  title: string
  banner?: any
}

const query = groq`
  *[_type == "exposition" && !(_id in path("drafts.**"))] | order(date desc) {
    _id,
    title,
    slug,
    banner
  }
`

export default function ExpositionIndexPage() {
  const [expositions, setExpositions] = useState<Exposition[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    client.fetch(query)
      .then((data) => {
        setExpositions(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setError('Erreur lors du chargement des expositions.')
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
          Expositions
        </h1>

        <div className="px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {expositions.map((item, index) => (
              <div
                key={item._id}
                className="w-full h-[300px]"
              >
                <SectionPosterCard
                  title={item.title}
                  slug={item.slug.current}
                  banner={item.banner}
                  basePath="exposition"
                />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
