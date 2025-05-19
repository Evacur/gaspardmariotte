import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'

export const config = {
  projectId: 'h3wae5wn',
  dataset: 'production',
  apiVersion: '2023-01-01',
  useCdn: true,
}

export const client = createClient(config)

export const urlFor = (source: any) => imageUrlBuilder(config).image(source)
