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
  const topImageUrl = topImage?._type === 'image' && topImage.asset ? urlFor(topImage).url() : null
  const bottomImageUrl = bottomImage?._type === 'image' && bottomImage.asset ? urlFor(bottomImage).url() : null
  const rightImageUrl = rightImage?._type === 'image' && rightImage.asset ? urlFor(rightImage).url() : null

  // Comptage images à gauche pour gérer hauteur partagée
  const leftImagesCount = [topImageUrl, bottomImageUrl].filter(Boolean).length
  const leftImageHeightClass = leftImagesCount === 2 ? 'h-1/2' : 'h-full'

  return (
    <div className="flex flex-col md:flex-row gap-[25px] h-[700px] max-w-screen-lg mx-auto">
      {/* Colonne gauche */}
      <div className="w-full md:w-1/2 flex flex-col gap-[25px] h-full">
        {topImageUrl ? (
          <div className={`${leftImageHeightClass} w-full overflow-hidden rounded-[2px]`}>
            <img
              src={topImageUrl}
              className="w-full h-full object-cover"
              alt="Image en haut à gauche"
            />
          </div>
        ) : (
          <div className={`${leftImageHeightClass} w-full bg-gray-200 rounded-[2px]`} aria-label="Image en haut à gauche non disponible" />
        )}

        {bottomImageUrl ? (
          <div className={`${leftImageHeightClass} w-full overflow-hidden rounded-[2px]`}>
            <img
              src={bottomImageUrl}
              className="w-full h-full object-cover"
              alt="Image en bas à gauche"
            />
          </div>
        ) : leftImagesCount === 2 ? (
          <div className={`${leftImageHeightClass} w-full bg-gray-200 rounded-[2px]`} aria-label="Image en bas à gauche non disponible" />
        ) : null}
      </div>

      {/* Colonne droite */}
      <div className="w-full md:w-1/2 h-full overflow-hidden rounded-[2px]">
        {rightImageUrl ? (
          <img
            src={rightImageUrl}
            className="w-full h-full object-cover"
            alt="Image à droite"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 rounded-[2px]" aria-label="Image à droite non disponible" />
        )}
      </div>
    </div>
  )
}
