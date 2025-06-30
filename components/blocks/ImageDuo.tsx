import { urlFor } from '@/lib/sanity'

export default function ImageDuo({
  leftImage,
  rightImage,
}: {
  leftImage: any
  rightImage: any
}) {
  const leftImageUrl = leftImage?._type === 'image' && leftImage.asset ? urlFor(leftImage).url() : null
  const rightImageUrl = rightImage?._type === 'image' && rightImage.asset ? urlFor(rightImage).url() : null

  return (
    <div className="flex flex-col md:flex-row gap-[25px] h-[700px] max-w-screen-lg mx-auto">
      {/* Image gauche */}
      <div className="w-full md:w-1/2 h-full overflow-hidden rounded-[2px]">
        {leftImageUrl ? (
          <img
            src={leftImageUrl}
            className="w-full h-full object-cover"
            alt="Image gauche"
          />
        ) : (
          <div className="w-full h-full bg-gray-200" aria-label="Image gauche non disponible" />
        )}
      </div>

      {/* Image droite */}
      <div className="w-full md:w-1/2 h-full overflow-hidden rounded-[2px]">
        {rightImageUrl ? (
          <img
            src={rightImageUrl}
            className="w-full h-full object-cover"
            alt="Image droite"
          />
        ) : (
          <div className="w-full h-full bg-gray-200" aria-label="Image droite non disponible" />
        )}
      </div>
    </div>
  )
}
