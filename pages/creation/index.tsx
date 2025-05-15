import { useEffect, useState } from 'react'
import { client, urlFor } from '@/lib/sanity'
import { groq } from 'next-sanity'
import Link from 'next/link'

const query = groq`
  *[_type == "creationSection"] | order(order asc) {
    _id,
    title,
    slug,
    description,
    image,
    order
  }
`

export default function CreationMenuPage() {
  const [sections, setSections] = useState([])

  useEffect(() => {
    client.fetch(query).then((data) => {
      setSections(data)
    })
  }, [])

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
