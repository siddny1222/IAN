import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { usePerformanceProfile } from '../context/usePerformanceProfile'
import { primeMedia } from '../lib/mediaLoader'
import { buildMediaQueue, withBase } from '../lib/performance'
import { primeThemeSceneRoute } from '../lib/routeModules'
import {
  fragmentText,
  dimensions,
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
  const navigate = useNavigate()
  const performanceProfile = usePerformanceProfile()
  const hiddenScene = dimensions.find((dimension) => dimension.hidden)
  const coordinate = pickLocalized(scene.coordinate, language)
  const titleParts = fragmentText(pickLocalized(scene.title, language))

  const primeScene = () => {
    void primeThemeSceneRoute()
    void primeMedia(buildMediaQueue(
      [scene.media.still, scene.media.texture, scene.media.overlay, scene.media.relic],
      performanceProfile,
      { limit: 4 },
    ))
  }
  const toneStyle = {
    '--card-a': scene.palette[0],
    '--card-b': scene.palette[1],
    '--card-c': scene.palette[2],
    '--card-d': scene.palette[3],
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
        onFocus={primeScene}
        onMouseEnter={primeScene}
        onTouchStart={primeScene}
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
      onClick={(event) => {
        if (!hiddenScene || scene.slug === hiddenScene.slug || Math.random() >= 0.2) {
          return
        }

        event.preventDefault()
        navigate(hiddenScene.path)
      }}
      onFocus={primeScene}
      onMouseEnter={primeScene}
      onTouchStart={primeScene}
      style={toneStyle}
      to={scene.path}
    >
      {content}
    </Link>
  )
}
