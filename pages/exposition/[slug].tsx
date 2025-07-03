import { GetStaticPaths, GetStaticProps } from 'next'
import { groq } from 'next-sanity'
import { client } from '@/lib/sanity'
import Header from '@/components/Header'
import ProjectBanner from '@/components/ProjectBanner'
import { ProjectNavContainer } from '@/components/ProjectNavCard' // Import du container
import ImageDuo from '@/components/blocks/ImageDuo'
import ImageText from '@/components/blocks/ImageText'
import ImageTriple from '@/components/blocks/ImageTriple'
import VideoBlock from '@/components/blocks/VideoBlock'

type Exposition = {
  title: string
  slug: { current: string }
  date?: string
  lieu?: string
  organisateur?: string
  banner?: any
  sections?: any[]
}

type Props = {
  data: Exposition
  previousProject: Exposition | null
  nextProject: Exposition | null
}

export default function ExpositionPage({ data, previousProject, nextProject }: Props) {
  return (
    <div className="bg-white">
      <Header dark={true} />

      <ProjectBanner
        title={data.title}
        slug={data.slug.current}
        banner={data.banner}
        infoItems={[
          { label: 'Date', value: data.date?.slice(0, 4) },
          { label: 'Lieu', value: data.lieu },
          { label: 'Organisateur', value: data.organisateur },
        ]}
      />

      <main className="px-6 py-6 max-w-6xl mx-auto space-y-6">
        {data.sections?.map((block, index) => {
          switch (block._type) {
            case 'videoBlock':
              return <VideoBlock key={index} video={block.video} />
            case 'imageDuo':
              return <ImageDuo key={index} leftImage={block.leftImage} rightImage={block.rightImage} />
            case 'imageText':
              return (
                <ImageText
                  key={index}
                  image={block.image}
                  imagePosition={block.imagePosition || 'left'}
                  title={block.title}
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
              basePath="exposition"
            />
          </div>
        )}
      </main>
    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = await client.fetch(
    groq`*[_type == "exposition" && defined(slug.current)]{ slug }`
  )
  return {
    paths: slugs.map(({ slug }: any) => ({ params: { slug: slug.current } })),
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params as { slug: string }

  const allProjects: Exposition[] = await client.fetch(
    groq`*[_type == "exposition"] | order(date desc) {
      title,
      slug,
      banner
    }`
  )

  const index = allProjects.findIndex((p) => p.slug.current === slug)
  const previousProject = allProjects[index - 1] || null
  const nextProject = allProjects[index + 1] || null

  const data = await client.fetch(
    groq`*[_type == "exposition" && slug.current == $slug][0] {
      title,
      slug,
      date,
      lieu,
      banner,
      organisateur,
      sections[] { ... }
    }`,
    { slug }
  )

  if (!data) {
    return { notFound: true }
  }

  return {
    props: {
      data,
      previousProject,
      nextProject,
    },
  }
}