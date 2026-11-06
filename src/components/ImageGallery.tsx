import type { GalleryImage } from '../data/profile'
import { assetUrl } from '../lib/assets'
import Reveal from './Reveal'

export default function ImageGallery({ images }: { images: GalleryImage[] }) {
  const portrait = images.every((image) => image.portrait)

  return (
    <div className={`grid gap-5 ${portrait ? 'grid-cols-2 lg:grid-cols-4' : 'md:grid-cols-2'}`}>
      {images.map((image) => (
        <Reveal key={image.image}>
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
