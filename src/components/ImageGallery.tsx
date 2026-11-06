import type { GalleryImage } from '../data/profile'
import { assetUrl } from '../lib/assets'
import Reveal from './Reveal'

export default function ImageGallery({ images }: { images: GalleryImage[] }) {
  const portrait = images.every((image) => image.portrait)
  // With an odd number of wide images, the first one spans the row so the grid has no hole.
  const leadSpans = !portrait && images.length % 2 === 1

  return (
    <div className={`grid gap-5 ${portrait ? 'grid-cols-2 lg:grid-cols-4' : 'md:grid-cols-2'}`}>
      {images.map((image, index) => (
        <Reveal key={image.image} className={leadSpans && index === 0 ? 'md:col-span-2' : ''}>
          <figure className="hud-panel p-2">
            <img
              src={assetUrl(image.image)}
              alt={image.alt}
              loading="lazy"
              decoding="async"
              className={`w-full object-cover object-top ${image.portrait ? 'aspect-[4/5]' : 'aspect-video'}`}
            />
            <figcaption className="px-2 py-3 font-mono text-sm text-muted">{image.caption}</figcaption>
          </figure>
        </Reveal>
      ))}
    </div>
  )
}
