import { GetStaticPaths, GetStaticProps } from 'next'
import { groq } from 'next-sanity'
import { client, urlFor } from '@/lib/sanity'
import Header from '@/components/Header'

type Creation = {
  _id: string
  title: string
  category: string
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
      category,
      date,
      image
    }
  }
`

export default function CreationSlugPage({ title, creations }: Props) {
  return (
    <div className="bg-white">
      <Header dark={false} />
      <main className="min-h-screen flex md:items-start sm:items-center justify-center flex-col bg-white py-12">
        {/* Titre avec espacement de 8px vers le carrousel */}
        <h1 className="md:text-6xl sm:text-2xl font-clash font-semibold mb-2 px-4">
          {title}
        </h1>

        {/* Carrousel */}
        <div className="flex flex-col gap-6 md:flex-row md:gap-2 overflow-x-auto hide-scrollbar w-full px-4">
          {creations.map((creation) => (
            <div
              key={creation._id}
              className="flex-shrink-0 flex flex-col items-start w-full md:w-[500px]"
            >
              {creation.image && (
                <img
                  src={urlFor(creation.image).width(500).height(500).fit('crop').url()}
                  alt={creation.title}
                  className="w-full max-w-[500px] h-auto aspect-square object-cover rounded-sm"
                />
              )}
              <div className="mt-2 flex flex-col gap-0">
                <h2 className="text-sm md:text-base font-bold">{creation.title}</h2>
                <p className="text-sm text-black/70 font-satoshi">
                  <span className="font-semibold">{creation.category}</span>
                  {creation.date && `, ${creation.date}`}
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

// Génération des chemins dynamiques
export const getStaticPaths: GetStaticPaths = async () => {
  const slugs: { slug: { current: string } }[] = await client.fetch(
    groq`*[_type == "creationSection" && defined(slug.current)]{ slug }`
  )

  return {
    paths: slugs.map(({ slug }) => ({
      params: { slug: slug.current },
    })),
    fallback: false,
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
  }
}
