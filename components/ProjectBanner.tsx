import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import { urlFor } from '@/lib/sanity'

type InfoItem = {
  label: string
  value?: string
}

type Props = {
  title: string
  slug: string
  banner?: any
  infoItems: InfoItem[]
}

export default function ProjectBanner({ title, slug, banner, infoItems }: Props) {
  const router = useRouter()

  return (
    <motion.div
      key={router.asPath} // clé liée à la route pour forcer remount
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="relative w-full h-[45vh] text-white overflow-hidden"
    >
      {/* Image de fond */}
      {banner && (
        <img
          src={urlFor(banner).url()}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 z-10" />

      {/* Contenu aligné en bas */}
      <div className="relative z-20 h-full flex flex-col justify-end px-4 pb-4">
        <div className="w-full max-w-screen-lg mx-auto">
          {/* Titre animé */}
          <motion.h1
            initial={{ opacity: 0, y: 300 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1.5,
              ease: [0.11, 0.68, 0.17, 0.99],
            }}
            className="text-[24px] md:text-[30px] lg:text-[40px] font-bold leading-tight break-words mb-2 md:mb-[30px]"
          >
            {title}
          </motion.h1>

          {/* Infos dynamiques animées */}
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-[12px] md:text-[14px] text-white/90">
            {infoItems.map(({ label, value }, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 300 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 1.5,
                  delay: (index + 1) * 0.2,
                  ease: [0.11, 0.68, 0.17, 0.99],
                }}
                className="max-w-[300px] min-w-[50px]"
              >
                <p className="font-semibold tracking-wide text-white">{label}</p>
                <p className="break-words">{value || '—'}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
