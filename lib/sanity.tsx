import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'

export const config = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '730lhcwc',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2023-01-01',
  useCdn: process.env.NODE_ENV === 'production',
  token: process.env.SANITY_API_TOKEN,
}

export const client = createClient(config)

export const urlFor = (source: any) =>
  imageUrlBuilder(config).image(source)
