import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
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
  const router = useRouter()
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
          Expositions
        </motion.h1>

        <div className="px-4 lg:px-0">
          <div className="w-full max-w-screen-xl mx-auto items-center">
            <div className="flex flex-wrap gap-6 lg:justify-center xl:justify-start">
              {expositions.map((item, index) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 1.5,
                    delay: 0.5 + index * 0.15,
                    ease: [0.5, 0.7, 0.17, 0.9],
                  }}
                  className="w-full md:w-1/3 lg:w-[250px] h-[300px]"
                >
                  <SectionPosterCard
                    title={item.title}
                    slug={item.slug.current}
                    banner={item.banner}
                    basePath="exposition"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </motion.div>
  )
}
