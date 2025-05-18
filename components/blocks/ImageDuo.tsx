import { urlFor } from '@/lib/sanity'

export default function ImageDuo({
  leftImage,
  rightImage,
}: {
  leftImage: any
  rightImage: any
}) {
  return (
    <div className="flex flex-col md:flex-row gap-[25px] h-[700px] max-w-screen-lg mx-auto">
      {/* Image gauche */}
      <div className="w-full md:w-1/2 h-full overflow-hidden rounded-[2px]">
        <img
          src={urlFor(leftImage).url()}
          className="w-full h-full object-cover"
          alt="Image gauche"
        />
      </div>

      {/* Image droite */}
      <div className="w-full md:w-1/2 h-full overflow-hidden rounded-[2px]">
        <img
          src={urlFor(rightImage).url()}
          className="w-full h-full object-cover"
          alt="Image droite"
        />
      </div>
    </div>
  )
}
