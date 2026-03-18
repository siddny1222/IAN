import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { usePerformanceProfile } from '../context/usePerformanceProfile'
import { primeMedia } from '../lib/mediaLoader'
import { buildMediaQueue, withBase } from '../lib/performance'
import { primeThemeSceneRoute } from '../lib/routeModules'
import {
  fragmentText,
  pickLocalized,
  type Dimension,
  type Language,
} from '../data/scenes'

type SceneCardProps = {
  compact?: boolean
  disabled?: boolean
  language: Language
  onActivate?: (dimension: Dimension) => void
  scene: Dimension
  style?: CSSProperties
}

export default function SceneCard({
  compact,
  disabled,
  language,
  onActivate,
  scene,
  style,
}: SceneCardProps) {
  const performanceProfile = usePerformanceProfile()
  const coordinate = pickLocalized(scene.coordinate, language)
  const titleParts = fragmentText(pickLocalized(scene.title, language))
  const toneStyle = {
    '--card-a': scene.palette[0],
    '--card-b': scene.palette[1],
    '--card-c': scene.palette[3],
    ...style,
  } as CSSProperties

  const content = (
    <>
      <span
        aria-hidden="true"
        className="scene-card__image"
        style={{ backgroundImage: `url(${withBase(scene.media.still)})` }}
      ></span>
      <span aria-hidden="true" className="scene-card__mist"></span>
      <span className="scene-card__tab" data-ghost-text={coordinate}>{coordinate}</span>
      <strong>
        {titleParts.map((part, index) => (
          <span data-ghost-text={part} key={`${part}-${index}`}>{part}</span>
        ))}
      </strong>
    </>
  )

  if (onActivate) {
    return (
      <button
        className={`scene-card ${compact ? 'scene-card--compact' : ''}`}
        data-tone={scene.tone}
        disabled={disabled}
        onFocus={() => {
          void primeThemeSceneRoute()
          void primeMedia(buildMediaQueue(
            [scene.media.still, scene.media.texture, scene.media.overlay, scene.media.relic],
            performanceProfile,
            { limit: 4 },
          ))
        }}
        onMouseEnter={() => {
          void primeThemeSceneRoute()
          void primeMedia(buildMediaQueue(
            [scene.media.still, scene.media.texture, scene.media.overlay, scene.media.relic],
            performanceProfile,
            { limit: 4 },
          ))
        }}
        onTouchStart={() => {
          void primeThemeSceneRoute()
          void primeMedia(buildMediaQueue(
            [scene.media.still, scene.media.texture, scene.media.overlay, scene.media.relic],
            performanceProfile,
            { limit: 4 },
          ))
        }}
        onClick={() => onActivate(scene)}
        style={toneStyle}
        type="button"
      >
        {content}
      </button>
    )
  }

  return (
    <Link
      className={`scene-card ${compact ? 'scene-card--compact' : ''}`}
      data-tone={scene.tone}
      onFocus={() => {
        void primeThemeSceneRoute()
        void primeMedia(buildMediaQueue(
          [scene.media.still, scene.media.texture, scene.media.overlay, scene.media.relic],
          performanceProfile,
          { limit: 4 },
        ))
      }}
      onMouseEnter={() => {
        void primeThemeSceneRoute()
        void primeMedia(buildMediaQueue(
          [scene.media.still, scene.media.texture, scene.media.overlay, scene.media.relic],
          performanceProfile,
          { limit: 4 },
        ))
      }}
      onTouchStart={() => {
        void primeThemeSceneRoute()
        void primeMedia(buildMediaQueue(
          [scene.media.still, scene.media.texture, scene.media.overlay, scene.media.relic],
          performanceProfile,
          { limit: 4 },
        ))
      }}
      style={toneStyle}
      to={scene.path}
    >
      {content}
    </Link>
  )
}
