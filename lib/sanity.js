// /lib/sanity.ts

import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

// Connexion au projet Sanity
export const client = createClient({
  projectId: 'h3wae5wn',       // Ton vrai ID Sanity
  dataset: 'production',
  apiVersion: '2023-01-01',
  useCdn: true,
})

// Générateur d’URL pour les images Sanity
const builder = imageUrlBuilder(client)

export const urlFor = (source) => builder.image(source)

