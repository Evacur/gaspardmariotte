import { useState, useEffect } from 'react'
import { GetStaticPaths, GetStaticProps } from 'next'
import { groq } from 'next-sanity'
import { client, urlFor } from '@/lib/sanity'
import Header from '@/components/Header'

type Creation = {
  _id: string
  title: string
  technique: string
  format: string
  date: string
  image: any
}

type Props = {
  title: string
  creations: Creation[]
}

const query = groq`
  *[_type == "creationSection" && slug.current == $slug][0]{
    title,
    "creations": *[_type == "creation" && references(^._id)] | order(date desc){
      _id,
      title,
      technique,
      format,
      "date": date[0..3],
      image
    }
  }
`

export default function CreationSlugPage({ title, creations }: Props) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth < 600)
    checkIsMobile()
    window.addEventListener("resize", checkIsMobile)
    return () => window.removeEventListener("resize", checkIsMobile)
  }, [])

  return (
    <div className="bg-white">
      <Header dark={false} className="fixed top-0 left-0 w-full z-30" backSlugPath={undefined} />

      <main className={`${isMobile ? 'pt-20' : 'pt-16'} min-h-screen flex md:items-start sm:items-center justify-center flex-col bg-white py-12`}>
        <h1 className="md:text-6xl sm:text-2xl font-clash font-black mb-2 px-4">
          {title}
        </h1>

        <div className="flex flex-col gap-6 md:flex-row md:gap-2 overflow-x-auto hide-scrollbar w-full px-4">
          {creations.map((creation) => {
            const thumbnailUrl = urlFor(creation.image)
              .width(500).height(500).fit('crop').auto('format').quality(85).url()
            const thumbnailUrl2x = urlFor(creation.image)
              .width(1000).height(1000).fit('crop').auto('format').quality(85).url()
            const fullImageUrl = urlFor(creation.image)
              .width(2000).auto('format').quality(90).url()

            return (
              <div key={creation._id} className="flex-shrink-0 flex flex-col items-start w-full md:w-[500px]">
                {creation.image && (
                  <img
                    src={thumbnailUrl}
                    srcSet={`${thumbnailUrl} 1x, ${thumbnailUrl2x} 2x`}
                    alt={creation.title}
                    className="w-full max-w-[500px] h-auto aspect-square object-cover rounded-sm cursor-pointer"
                    onClick={() => setSelectedImage(fullImageUrl)}
                  />
                )}
                <div className="mt-2 flex flex-col gap-0">
                  <h2 className="text-sm md:text-base font-bold">{creation.title}</h2>
                  <p className="text-sm text-black/70 font-satoshi">
                    {[creation.format, creation.technique, creation.date].filter(Boolean).join(', ')}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </main>

      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="Image en plein écran"
            className="max-h-[90vh] max-w-[90vw] object-contain rounded"
          />
        </div>
      )}
    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs: { slug: { current: string } }[] = await client.fetch(
    groq`*[_type == "creationSection" && defined(slug.current)]{ slug }`
  )

  return {
    paths: slugs.map(({ slug }) => ({
      params: { slug: slug.current },
    })),
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params as { slug: string }
  const data = await client.fetch(query, { slug })

  return {
    props: {
      title: data.title,
      creations: data.creations,
    },
    revalidate: 300,
  }
}
