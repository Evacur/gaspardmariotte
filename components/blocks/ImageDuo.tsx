import { urlFor } from '@/lib/sanity'

export default function ImageDuo({ leftImage, rightImage }: { leftImage: any; rightImage: any }) {
  return (
    <div className="flex flex-col sm:flex-row gap-[25px]">
      <img src={urlFor(leftImage).url()} className="w-full sm:w-1/2 object-cover rounded" />
      <img src={urlFor(rightImage).url()} className="w-full sm:w-1/2 object-cover rounded" />
    </div>
  )
}
