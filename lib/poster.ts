import { urlFor } from '@/lib/sanity'

export const getPosterUrl = (image: any) => {
  try {
    if (!image) return null
    return urlFor(image)
      .width(2000)
      .auto('format')
      .quality(85)
      .url()
  } catch {
    return null
  }
}


