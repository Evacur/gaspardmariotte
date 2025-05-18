import { urlFor } from '@/lib/sanity'
import { PortableText } from '@portabletext/react'

export default function ImageText({
  image,
  imagePosition,
  title,
  text,
}: {
  image: any
  imagePosition: 'left' | 'right'
  title?: string
  text: any[]
}) {
  const ImageElement = (
    <img
      src={urlFor(image).url()}
      className="w-full md:w-3/5 max-h-[500px] object-cover rounded-sm"
      alt=""
    />
  )

  const TextElement = (
    <div className="w-full md:w-2/5 px-6 sm:px-4">
      {title && <h3 className="text-xl font-clash font-semibold mb-4 text-center">{title}</h3>}
      <div className="prose max-w-none text-justify">
        <PortableText value={text} />
      </div>
    </div>
  )


  return (
    <div className="flex flex-col md:flex-row gap-6 items-start max-w-screen-lg mx-auto">
      {imagePosition === 'left' ? (
        <>
          {ImageElement}
          {TextElement}
        </>
      ) : (
        <>
          {TextElement}
          {ImageElement}
        </>
      )}
    </div>
  )
}
