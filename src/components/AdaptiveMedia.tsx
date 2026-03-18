import { usePerformanceProfile } from '../context/usePerformanceProfile'
import {
  getMediaFallbackPath,
  isVideoPath,
  shouldSkipHighCostMedia,
  withBase,
} from '../lib/performance'

type AdaptiveMediaProps = {
  alt?: string
  ariaHidden?: boolean
  autoPlay?: boolean
  className: string
  decoding?: 'async' | 'sync' | 'auto'
  forceStatic?: boolean
  loading?: 'eager' | 'lazy'
  loop?: boolean
  muted?: boolean
  path?: string
  playsInline?: boolean
  poster?: string
  preload?: 'none' | 'metadata' | 'auto'
  staticFallback?: string
}

export default function AdaptiveMedia({
  alt = '',
  ariaHidden = true,
  autoPlay = false,
  className,
  decoding = 'async',
  forceStatic = false,
  loading = 'eager',
  loop = false,
  muted = true,
  path,
  playsInline = true,
  poster,
  preload,
  staticFallback,
}: AdaptiveMediaProps) {
  const profile = usePerformanceProfile()

  if (!path) {
    return null
  }

  const fallbackPath = staticFallback ?? poster ?? getMediaFallbackPath(path)
  const shouldRenderStatic = forceStatic
    || (profile.preferStaticMedia && shouldSkipHighCostMedia(path, profile))

  if (shouldRenderStatic && fallbackPath) {
    return (
      <img
        alt={alt}
        aria-hidden={ariaHidden}
        className={className}
        decoding={decoding}
        loading={loading}
        src={withBase(fallbackPath)}
      />
    )
  }

  if (isVideoPath(path)) {
    return (
      <video
        aria-hidden={ariaHidden}
        autoPlay={autoPlay}
        className={className}
        loop={loop}
        muted={muted}
        playsInline={playsInline}
        poster={fallbackPath ? withBase(fallbackPath) : undefined}
        preload={preload ?? (loading === 'lazy' || profile.preferStaticMedia ? 'none' : 'metadata')}
      >
        <source src={withBase(path)} />
      </video>
    )
  }

  return (
    <img
      alt={alt}
      aria-hidden={ariaHidden}
      className={className}
      decoding={decoding}
      loading={loading}
      src={withBase(path)}
    />
  )
}
