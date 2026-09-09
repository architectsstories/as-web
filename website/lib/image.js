import imageUrlBuilder from '@sanity/image-url'
import {client} from './sanity'

const builder = imageUrlBuilder(client)

// Usage: <img src={urlFor(project.mainImage).width(800).url()} />
export function urlFor(source) {
  return builder.image(source)
}
