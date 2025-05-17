import { urlFor } from '@/lib/sanity'

export default function ImageTriple({
  topImage,
  bottomImage,
  rightImage,
}: {
  topImage: any
  bottomImage: any
  rightImage: any
}) {
  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="flex flex-col gap-6 md:w-1/2">
        <img src={urlFor(topImage).url()} className="w-full h-full object-cover rounded" />
        <img src={urlFor(bottomImage).url()} className="w-full h-full object-cover rounded" />
      </div>
      <img src={urlFor(rightImage).url()} className="w-full md:w-1/2 object-cover rounded" />
    </div>
  )
}
