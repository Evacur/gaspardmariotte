import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'

export const config = {
  projectId: '730lhcwc',
  dataset: 'production',
  apiVersion: '2023-01-01',
  useCdn: true,
  token: process.env.skcuwaCMSPPqESLP8ONOuFqHM254K9NrEGH9QisA7eVc4dSPitCexzeDgvWfmT3Y7ORfZztuXEF1pDv1wM3ktvK0U5VB4lwwCDVAgWZ5IQxrYS5L2Cb5afz3umOAyvSmWZ7F3ZL6symshezFQRxZnymbCwgtBU1UtANlXTeBk9R8ozviZMDw,
}

export const client = createClient(config)

export const urlFor = (source: any) => imageUrlBuilder(config).image(source)
