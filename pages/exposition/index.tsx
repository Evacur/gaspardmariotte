import { useEffect, useState } from 'react'
import { client } from '@/lib/sanity'
import { groq } from 'next-sanity'
import Header from '@/components/Header'
import SectionPosterCard from '@/components/SectionPosterCard'

type Exposition = {
    _id: string
    slug: { current: string }
    title: string
    banner?: any
}

const query = groq`
  *[_type == "exposition" && !(_id in path("drafts.**"))] | order(date desc) {
    _id,
    title,
    slug,
    banner
  }
`
export default function ExpositionIndexPage() {
    const [expositions, setExpositions] = useState<Exposition[]>([])

    useEffect(() => {
        client.fetch(query).then((data) => setExpositions(data))
    }, [])

    return (
        <div className="bg-white">
            <Header dark={false} />

            <main className="px-4 pt-32 pb-12">
                <h1 className="text-4xl font-clash md:text-6xl font-semibold mb-8 text-center">Expositions</h1>

                <div className="flex justify-center">
                    <div className="flex flex-wrap gap-4 w-full max-w-screen-xl">
                        {expositions.map((item) => (
                            <SectionPosterCard
                                key={item._id}
                                title={item.title}
                                slug={item.slug.current}
                                banner={item.banner}
                                basePath="exposition"
                            />
                        ))}
                    </div>
                </div>
            </main>
        </div>
    )
}