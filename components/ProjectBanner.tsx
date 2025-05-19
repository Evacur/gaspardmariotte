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

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 z-10" />

      {/* Contenu aligné en bas */}
      <div className="relative z-20 h-full flex flex-col justify-end px-4 pb-6 md:pb-2">
        {/* max-w si tu veux centrer horizontalement */}
        <div className="w-full max-w-screen-lg mx-auto">
          {/* Titre */}
          <h1 className="text-3xl sm:text-2xl md:text-6xl font-bold mb-3 leading-tight break-words">
            {title}
          </h1>

          {/* Infos */}
          <div className="grid grid-cols-3 gap-x-4 gap-y-8 text-sm md:flex md:flex-wrap md:gap-y-2 text-white/90">
            <div className="flex flex-col">
              <p className="text-sm font-semibold tracking-wide text-white">Année</p>
              <p>{annee ? annee.slice(0, 4) : '—'}</p>
            </div>
            <div className="flex flex-col">
              <p className="text-sm font-semibold tracking-wide text-white">Surface</p>
              <p>{surface || '—'}</p>
            </div>
            <div className="flex flex-col">
              <p className="text-sm font-semibold tracking-wide text-white">Client</p>
              <p>{client || '—'}</p>
            </div>
            <div className="flex flex-col pb-0 md:pb-0">
              <p className="text-sm font-semibold tracking-wide text-white">Prestation</p>
              <p>{prestation || '—'}</p>
            </div>
            <div className="flex flex-col pb-0 md:pb-0">
              <p className="text-sm font-semibold tracking-wide text-white">Lieu</p>
              <p>{lieu || '—'}</p>
            </div>
            <div className="hidden md:block" />
          </div>
        </div>
      </div>
    </div>
  )
}
