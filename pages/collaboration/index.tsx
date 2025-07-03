import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import { client } from '@/lib/sanity'
import { groq } from 'next-sanity'
import Header from '@/components/Header'
import SectionPosterCard from '@/components/SectionPosterCard'
import ProjectNavCard from '@/components/ProjectNavCard'

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
    <motion.div
      key={router.asPath}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5 }}
      className="bg-white"
    >
      <Header dark={false} />

      <main className="pt-32 pb-12">
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 3, ease: [0.11, 0.68, 0.17, 0.99] }}
          className="text-4xl font-clash md:text-6xl font-semibold mb-8 text-center"
        >
          Collaborations
        </motion.h1>

        {/* Container responsive */}
        <div className="px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {collaborations.map((item, index) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 1.5,
                  delay: 0.5 + index * 0.15,
                  ease: [0.5, 0.7, 0.17, 0.9],
                }}
                className="w-full h-[300px]"
              >
                <SectionPosterCard
                  title={item.title}
                  slug={item.slug.current}
                  banner={item.banner}
                  basePath="collaboration"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </motion.div>
  )
}