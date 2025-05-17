import { urlFor } from '@/lib/sanity'
import { PortableText } from '@portabletext/react'

export default function ImageText({
  image,
  imagePosition,
  text,
}: {
  image: any
  imagePosition: 'left' | 'right'
  text: any[]
}) {
  return (
    <div className={`flex flex-col md:flex-row gap-6 items-center`}>
      {imagePosition === 'left' && (
        <img src={urlFor(image).url()} className="w-full md:w-3/5 rounded" />
      )}
      <div className="md:w-2/5 prose max-w-none">
        <PortableText value={text} />
      </div>
      {imagePosition === 'right' && (
        <img src={urlFor(image).url()} className="w-full md:w-3/5 rounded" />
      )}
    </div>
  )
}
