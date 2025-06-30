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
  const isValidImage = (image: any) => image?._type === 'image' && image.asset
  const topImageUrl = isValidImage(topImage) ? urlFor(topImage).url() : null
  const bottomImageUrl = isValidImage(bottomImage) ? urlFor(bottomImage).url() : null
  const rightImageUrl = isValidImage(rightImage) ? urlFor(rightImage).url() : null

  const leftImagesCount = [topImageUrl, bottomImageUrl].filter(Boolean).length
  const leftImageHeight = leftImagesCount === 2 ? 'h-1/2' : 'h-full'

  return (
    <div className="flex flex-col md:flex-row gap-[25px] h-[700px] max-w-screen-lg mx-auto">
      {/* Colonne gauche */}
      <div className="w-full md:w-1/2 flex flex-col gap-[25px] h-full">
        {topImageUrl && (
          <div className={`${leftImageHeight} w-full overflow-hidden rounded-[2px]`}>
            <img
              src={topImageUrl}
              className="w-full h-full object-cover"
              alt="Image en haut à gauche"
            />
          </div>
        )}
        {bottomImageUrl && (
          <div className={`${leftImageHeight} w-full overflow-hidden rounded-[2px]`}>
            <img
              src={bottomImageUrl}
              className="w-full h-full object-cover"
              alt="Image en bas à gauche"
            />
          </div>
        )}
      </div>

      {/* Colonne droite */}
      {rightImageUrl && (
        <div className="w-full md:w-1/2 h-full overflow-hidden rounded-[2px]">
          <img
            src={rightImageUrl}
            className="w-full h-full object-cover"
            alt="Image à droite"
          />
        </div>
      )}
    </div>
  )
}
