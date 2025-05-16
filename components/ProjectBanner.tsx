import { urlFor } from '@/lib/sanity'

type Props = {
  title: string
  slug: string
  banner?: any
  annee?: string
  lieu?: string
  surface?: string
  prestation?: string
}

export default function ProjectBanner({
  title,
  slug,
  banner,
  annee,
  lieu,
  surface,
  prestation,
}: Props) {
  return (
    <div className="relative w-full h-[45vh] text-white overflow-hidden">
      {banner && (
        <img
          src={urlFor(banner).url()}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
      )}
      <div className="absolute inset-0 bg-black/40 z-10" />

      <div className="absolute bottom-0 left-0 right-0 z-20 px-4 pb-4 md:px-6 md:pb-6">
        <div className="max-w-screen-lg mx-auto">
          <h1 className="text-xl lg:text-7xl md:text-6xl font-bold mb-3">{title}</h1>

          <div className="flex flex-wrap items-center gap-6 text-sm md:text-base text-white/90">
            <div>
              <p className="text-sm font-semibold tracking-wide text-white/100">Année</p>
              <p>{annee ? annee.slice(0, 4) : '—'}</p>
            </div>
            <div>
              <p className="text-sm font-semibold tracking-wide text-white/100">Lieu</p>
              <p>{lieu || '—'}</p>
            </div>
            <div>
              <p className="text-sm font-semibold tracking-wide text-white/100">Surface</p>
              <p>{surface || '—'}</p>
            </div>
            <div>
              <p className="text-sm font-semibold tracking-wide text-white/100">Prestation</p>
              <p>{prestation || '—'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}