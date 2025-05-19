import { GetStaticPaths, GetStaticProps } from 'next'
import { groq } from 'next-sanity'
import { client } from '@/lib/sanity'
import Header from '@/components/Header'
import ProjectBanner from '@/components/ProjectBanner'
import ProjectNavCard from '@/components/ProjectNavCard'
import ImageDuo from '@/components/blocks/ImageDuo'
import ImageText from '@/components/blocks/ImageText'
import ImageTriple from '@/components/blocks/ImageTriple'
import VideoBlock from '@/components/blocks/VideoBlock'

// Types

type Collaboration = {
  title: string
  slug: { current: string }
  annee?: string
  lieu?: string
  surface?: string
  prestation?: string
  banner?: any
  sections?: any[]
}

type Props = {
  data: Collaboration
  previousProject: Collaboration | null
  nextProject: Collaboration | null
}

// Component

export default function CollaborationPage({ data, previousProject, nextProject }: Props) {
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
        client={''} // à ajouter si besoin dans le schéma
      />

      <main className="px-6 py-12 max-w-6xl mx-auto space-y-6">
        {data.sections?.map((block, index) => {
          switch (block._type) {
            case 'videoBlock':
              return <VideoBlock key={index} video={block.video} />
            case 'imageDuo':
              return <ImageDuo key={index} leftImage={block.leftImage} rightImage={block.rightImage} />
            case 'imageText':
              return <ImageText key={index} image={block.image} imagePosition={block.imagePosition || 'left'} title={block.title} text={block.text || []} />
            case 'imageTriple':
              return <ImageTriple key={index} topImage={block.topImage} bottomImage={block.bottomImage} rightImage={block.rightImage} />
            default:
              return null
          }
        })}

        {/* Navigation vers projets suivant / précédent */}
        {(previousProject || nextProject) && (
          <div className="w-full max-w-screen-lg mx-auto flex flex-col md:flex-row h-[200px] gap-[25px]">
            {previousProject && previousProject.slug?.current && (
              <div className="w-full md:w-1/2">
                <ProjectNavCard
                  direction="prev"
                  slug={previousProject.slug.current}
                  banner={previousProject.banner}
                />
              </div>
            )}
            {nextProject && nextProject.slug?.current && (
              <div className="w-full md:w-1/2">
                <ProjectNavCard
                  direction="next"
                  slug={nextProject.slug.current}
                  banner={nextProject.banner}
                />
              </div>
            )}
          </div>
        )}


      </main>
    </div>
  )
}

// Routes dynamiques
export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = await client.fetch(groq`*[_type == "collaboration" && defined(slug.current)]{ slug }`)
  return {
    paths: slugs.map(({ slug }: any) => ({ params: { slug: slug.current } })),
    fallback: false,
  }
}

// Données de la page
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params as { slug: string }

  // Récupère tous les projets pour calculer le next / prev
  const allProjects: Collaboration[] = await client.fetch(
    groq`*[_type == "collaboration"] | order(annee desc) {
      title,
      slug,
      banner
    }`
  )

  const index = allProjects.findIndex((p) => p.slug.current === slug)
  const previousProject = allProjects[index - 1] || null
  const nextProject = allProjects[index + 1] || null

  const data = await client.fetch(
    groq`
      *[_type == "collaboration" && slug.current == $slug][0] {
        title,
        slug,
        annee,
        lieu,
        surface,
        prestation,
        banner,
        sections[] { ... }
      }
    `,
    { slug }
  )

  return {
    props: {
      data,
      previousProject,
      nextProject,
    },
  }
}
