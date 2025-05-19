import { urlFor } from '@/lib/sanity'

type Props = {
  title: string
  slug: string
  banner?: any
  annee?: string
  lieu?: string
  surface?: string
  prestation?: string
  client?: string
}

export default function ProjectBanner({
  title,
  slug,
  banner,
  annee,
  lieu,
  surface,
  prestation,
  client,
}: Props) {
  return (
    <div className="relative w-full h-[45vh] text-white overflow-hidden">
      {/* Image de fond */}
      {banner && (
        <img
          src={urlFor(banner).url()}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
      )}
      {/* Overlay sombre */}
      <div className="absolute inset-0 bg-black/40 z-10" />

      {/* Contenu */}
      <div className="absolute bottom-0 left-0 right-0 z-20 px-4 pb-6 md:px-6">
        <div className="max-w-screen-lg mx-auto">
          {/* Titre */}
          <h1 className="text-3xl sm:text-2xl md:text-6xl font-bold mb-6 leading-tight break-words">
            {title}
          </h1>

          {/* Grille mobile, flex md+ */}
          <div className="grid grid-cols-2 gap-y-4 gap-x-12 text-sm md:text-base text-white/90 md:flex md:flex-wrap md:gap-x-12">
            {/* Col 1 */}
            <div>
              <p className="text-sm font-semibold tracking-wide text-white">Année</p>
              <p>{annee ? annee.slice(0, 4) : '—'}</p>
            </div>
            <div>
              <p className="text-sm font-semibold tracking-wide text-white">Prestation</p>
              <p>{prestation || '—'}</p>
            </div>
            <div>
              <p className="text-sm font-semibold tracking-wide text-white">Surface</p>
              <p>{surface || '—'}</p>
            </div>
            <div>
              <p className="text-sm font-semibold tracking-wide text-white">Lieu</p>
              <p>{lieu || '—'}</p>
            </div>
            <div className="col-span-2 md:col-span-1">
              <p className="text-sm font-semibold tracking-wide text-white">Client</p>
              <p>{client || '—'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
