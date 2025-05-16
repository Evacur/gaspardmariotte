import { useEffect, useState } from 'react'
import { client, urlFor } from '@/lib/sanity'
import { groq } from 'next-sanity'
import Link from 'next/link'
import Header from '@/components/Header'

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
    <div className="bg-white">
      <Header dark={false} />
      <main className="px-6 py-16">
        <h1 className="sr-only">Créations</h1>

        <div className="space-y-6 lg:space-y-32">
          {sections.map((section, index) => (
            <Link
              key={section._id}
              href={`/creation/${section.slug.current}`}
              className="block group"
            >
              {/* 🖥️ Desktop layout */}
              <div className="hidden lg:flex items-center justify-between h-[490px]">
                {/* Texte à gauche */}
                <div className="flex flex-col justify-center max-w-xl">
                  <span className="text-sm font-medium mb-2">
                    {index + 1}/{sections.length}
                  </span>
                  <h2 className="text-6xl font-clash font-semibold leading-none mb-4">
                    {section.title}
                  </h2>
                  <p className="text-black text-base font-medium font-satoshi">{section.description}</p>
                </div>

                {/* Image à droite */}
                {section.image && (
                  <img
                    src={urlFor(section.image).width(395).height(490).fit('crop').url()}
                    alt={section.title}
                    className="w-[395px] h-[490px] object-cover rotate-[2deg] origin-center rounded-sm"
                  />
                )}
              </div>

              {/* 📱 Mobile layout */}
              <div className="relative h-[400px] flex lg:hidden overflow-hidden rounded-[2px]">
                {/* Image de fond */}
                {section.image && (
                  <img
                    src={urlFor(section.image).width(800).height(800).fit('crop').url()}
                    alt={section.title}
                    className="absolute inset-0 w-full h-full object-cover z-0 group-hover:scale-105 transition-transform duration-500"
                  />
                )}

                {/* Overlay sombre */}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors duration-300 z-10" />

                {/* Texte centré */}
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-white text-center px-6">
                  <h2 className="text-4xl font-clash font-semibold leading-tight mb-2">
                    {section.title}
                  </h2>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
