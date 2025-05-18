import { urlFor } from '@/lib/sanity'

export default function ImageTriple({
  topImage,
  bottomImage,
  rightImage,
}: {
  topImage?: any
  bottomImage?: any
  rightImage: any
}) {
  const leftImagesCount = [topImage, bottomImage].filter(Boolean).length
  const leftImageHeight = leftImagesCount === 2 ? 'h-1/2' : 'h-full'

  return (
    <div className="flex flex-col md:flex-row gap-[25px] h-[700px] max-w-screen-lg mx-auto">
      {/* Colonne gauche */}
      <div className="w-full md:w-1/2 flex flex-col gap-[25px] h-full">
        {topImage && (
          <div className={`${leftImageHeight} w-full overflow-hidden rounded-[2px]`}>
            <img
              src={urlFor(topImage).url()}
              className="w-full h-full object-cover"
              alt=""
            />
          </div>
        )}
        {bottomImage && (
          <div className={`${leftImageHeight} w-full overflow-hidden rounded-[2px]`}>
            <img
              src={urlFor(bottomImage).url()}
              className="w-full h-full object-cover"
              alt=""
            />
          </div>
        )}
      </div>

      {/* Colonne droite */}
      <div className="w-full md:w-1/2 h-full overflow-hidden rounded-[2px]">
        <img
          src={urlFor(rightImage).url()}
          className="w-full h-full object-cover"
          alt=""
        />
      </div>
    </div>
  )
}
