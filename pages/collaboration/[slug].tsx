import { GetStaticPaths, GetStaticProps } from 'next'
import { groq } from 'next-sanity'
import { client } from '@/lib/sanity'
import Header from '@/components/Header'
import ProjectBanner from '@/components/ProjectBanner'
import PageContent from '@/components/PageContent'
import { ProjectNavContainer } from '@/components/ProjectNavCard' // Import du container
import ImageDuo from '@/components/blocks/ImageDuo'
import ImageText from '@/components/blocks/ImageText'
import ImageTriple from '@/components/blocks/ImageTriple'
import VideoBlock from '@/components/blocks/VideoBlock'

type Collaboration = {
  title: string
  slug: { current: string }
  annee?: string
  lieu?: string
  client?: string
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

export default function CollaborationPage({ data, previousProject, nextProject }: Props) {
  return (
    <div className="bg-white">
      <Header dark={true} backSlugPath={previousProject ? `/collaboration/${previousProject.slug.current}` : undefined} />

      <ProjectBanner
        title={data.title}
        slug={data.slug.current}
        banner={data.banner}
        basePath="collaboration"
        infoItems={[
          { label: 'Année', value: data.annee?.slice(0, 4) },
          { label: 'Lieu', value: data.lieu },
          { label: 'Surface', value: data.surface },
          { label: 'Client', value: data.client },
          { label: 'Prestation', value: data.prestation },
        ]}
      />

      <PageContent className="px-6 py-6 max-w-screen-lg mx-auto space-y-6">
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

        {/* Navigation avec le nouveau container */}
        {(previousProject || nextProject) && (
          <div className="w-full max-w-screen-lg mx-auto">
            <ProjectNavContainer
              prevProject={previousProject ? {
                slug: previousProject.slug.current,
                banner: previousProject.banner,
                title: previousProject.title
              } : undefined}
              nextProject={nextProject ? {
                slug: nextProject.slug.current,
                banner: nextProject.banner,
                title: nextProject.title
              } : undefined}
              basePath="collaboration"
            />
          </div>
        )}
      </PageContent>
    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = await client.fetch(groq`*[_type == "collaboration" && defined(slug.current)]{ slug }`)
  return {
    paths: slugs.map(({ slug }: any) => ({ params: { slug: slug.current } })),
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params as { slug: string }

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
        client,
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
    revalidate: 300,
  }
}