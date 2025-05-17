import { GetStaticPaths, GetStaticProps } from 'next'
import { groq } from 'next-sanity'
import { client } from '@/lib/sanity'
import Header from '@/components/Header'
import ProjectBanner from '@/components/ProjectBanner'
import ImageDuo from '@/components/blocks/ImageDuo'
import ImageText from '@/components/blocks/ImageText'
import ImageTriple from '@/components/blocks/ImageTriple'
import VideoBlock from '@/components/blocks/VideoBlock'

type Collaboration = {
  title: string
  slug: { current: string }
  annee?: string
  lieu?: string
  surface?: string
  prestation?: string
  banner?: any
  sections?: {
    _type: string
    video?: any
    leftImage?: any
    rightImage?: any
    image?: any
    imagePosition?: 'left' | 'right'
    text?: any[]
    topImage?: any
    bottomImage?: any
  }[]
}

type Props = {
  data: Collaboration
}

export default function CollaborationPage({ data }: Props) {
  return (
    <div className="bg-white">
      <Header dark={true} />

      <ProjectBanner
        title={data.title}
        slug={data.slug.current}
        banner={data.banner}
        annee={data.annee}
        lieu={data.lieu}
        surface={data.surface}
        prestation={data.prestation}
      />

      <main className="px-6 py-12 max-w-6xl mx-auto space-y-16">
        {data.sections?.map((block, index) => {
          switch (block._type) {
            case 'videoBlock':
              return <VideoBlock key={index} video={block.video} />
            case 'imageDuo':
              return (
                <ImageDuo
                  key={index}
                  leftImage={block.leftImage}
                  rightImage={block.rightImage}
                />
              )
            case 'imageText':
              return (
                <ImageText
                  key={index}
                  image={block.image}
                  imagePosition={block.imagePosition || 'left'}
                  text={block.text || []}
                />
              )
            case 'imageTriple':
              return (
                <ImageTriple
                  key={index}
                  topImage={block.topImage}
                  bottomImage={block.bottomImage}
                  rightImage={block.rightImage}
                />
              )
            default:
              return null
          }
        })}
      </main>
    </div>
  )
}

// Génération des routes dynamiques
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

// Chargement des données pour chaque page
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
        sections[]{
          ...
        }
      }
    `,
    { slug }
  )

  return {
    props: { data },
  }
}
