import { GetStaticPaths, GetStaticProps } from 'next'
import { groq } from 'next-sanity'
import { client, urlFor } from '@/lib/sanity'
import Header from '@/components/Header'
import ProjectBanner from '@/components/ProjectBanner'
import { PortableText } from '@portabletext/react'

type Collaboration = {
  title: string
  slug: { current: string }
  annee?: string
  lieu?: string
  surface?: string
  prestation?: string
  banner?: any
  video?: any
  images?: any[]
  content?: {
    heading?: string
    body?: any[]
  }
}

type Props = {
  data: Collaboration
}

export default function CollaborationPage({ data }: Props) {
  return (
    <div className="bg-white">
      <Header dark={true} />

      {/* ✅ Bannière sans animation */}
      <ProjectBanner
        title={data.title}
        slug={data.slug.current}
        banner={data.banner}
        annee={data.annee}
        lieu={data.lieu}
        surface={data.surface}
        prestation={data.prestation}
      />

      <main className="px-6 py-12 max-w-6xl mx-auto">
        {/* Vidéo */}
        {data.video && (
          <div className="mb-12">
            <video
              src={urlFor(data.video).url()}
              controls
              className="w-full max-w-4xl mx-auto rounded-lg shadow"
            />
          </div>
        )}

        {/* Galerie d’images */}
        {data.images?.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {data.images.map((img, index) => (
              <img
                key={index}
                src={urlFor(img).width(800).height(800).fit('crop').url()}
                alt={`Image ${index + 1}`}
                className="w-full h-auto object-cover rounded"
              />
            ))}
          </div>
        )}

        {/* Texte riche */}
        {data.content?.heading && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{data.content.heading}</h2>
            <div className="prose prose-neutral max-w-none">
              <PortableText value={data.content.body} />
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

// Routes dynamiques
export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = await client.fetch(
    groq`*[_type == "collaboration" && defined(slug.current)]{ slug }`
  )

  return {
    paths: slugs.map(({ slug }: any) => ({
      params: { slug: slug.current },
    })),
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params as { slug: string }

  const data = await client.fetch(
    groq`
      *[_type == "collaboration" && slug.current == $slug][0]{
        title,
        slug,
        annee,
        lieu,
        surface,
        prestation,
        banner,
        video,
        images,
        content
      }
    `,
    { slug }
  )

  return {
    props: { data },
  }
}
