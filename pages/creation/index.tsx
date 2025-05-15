import { useEffect, useState } from 'react'
import { client, urlFor } from '@/lib/sanity'
import { groq } from 'next-sanity'
import Link from 'next/link'

type Section = {
  _id: string
  title: string
  slug: { current: string }
  description: string
  image: any
  order: number
}

const query = groq`*[_type == "creationSection"] | order(order asc) {
  _id,
  title,
  slug,
  description,
  image,
  order
}`

export default function CreationMenuPage() {
  const [sections, setSections] = useState<Section[]>([])
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    client
      .fetch<Section[]>(query)
      .then((data) => setSections(data))
      .catch((err) => setError(err))
  }, [])

  if (error) {
    return (
      <main className="p-8">
        <h1 className="text-3xl font-bold text-red-600">Erreur Sanity</h1>
        <pre className="bg-red-100 p-4 mt-4 rounded">{JSON.stringify(error, null, 2)}</pre>
      </main>
    )
  }

  return (
    <main className="px-8 py-16">
      <h1 className="text-7xl font-bold mb-16">Créations</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {sections.map((section, index) => (
          <Link
            key={section._id}
            href={`/creation/${section.slug.current}`}
            className="group block rounded-2xl overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow"
          >
            {section.image && (
              <img
                src={urlFor(section.image).width(800).height(500).fit('crop').url()}
                alt={section.title}
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              />
            )}
            <div className="p-6">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-2xl font-bold group-hover:underline">
                  {section.title}
                </h2>
                <span className="text-sm text-gray-400">{index + 1}/4</span>
              </div>
              <p className="text-gray-600">{section.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}
