import { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import AdaptiveMedia from '../components/AdaptiveMedia'
import SceneCard from '../components/SceneCard'
import { usePerformanceProfile } from '../context/usePerformanceProfile'
import { useLocale } from '../context/useLocale'
import { scheduleMediaWarmup } from '../lib/mediaLoader'
import { buildMediaQueue } from '../lib/performance'
import { primeHomeExperienceRoute } from '../lib/routeModules'
import {
  dimensions,
  dimensionArchiveIntroCopy,
  dimensionConceptCopy,
  type DimensionSlug,
  fragmentText,
  getDimensionBySlug,
  interfaceCopy,
  pickLocalized,
  pickLocalizedList,
} from '../data/scenes'

const sovietGlitchWords = [
  'СИГНАЛ',
  'ЭФИР',
  'ПОМЕХИ',
  'ЧАСТОТА',
  'РАЙОН-07',
  'БЛОК',
  'ЗИМА',
  'АРХИВ',
] as const

function MediaSurface({
  className,
  loading = 'eager',
  path,
  staticFallback,
}: {
  className: string
  loading?: 'eager' | 'lazy'
  path: string
  staticFallback?: string
}) {
  const mediaClass = /icon|logo|sticker|bliss/i.test(path)
    || /bsod/i.test(path)
    ? `${className} is-contained`
    : className

  return (
    <AdaptiveMedia
      autoPlay
      className={mediaClass}
      loading={loading}
      loop
      muted
      path={path}
      preload={loading === 'lazy' ? 'none' : 'metadata'}
      staticFallback={staticFallback}
    />
  )
}

export default function ThemeScene() {
  const { slug } = useParams()
  const { language } = useLocale()
  const performanceProfile = usePerformanceProfile()
  const scene = getDimensionBySlug(slug)
  const [sceneLayer, setSceneLayer] = useState<1 | 2 | 3>(1)
  const [activeArtifact, setActiveArtifact] = useState(0)
  const [hoveredArtifact, setHoveredArtifact] = useState<number | null>(null)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [slug])

  useEffect(() => {
    void primeHomeExperienceRoute()
  }, [])

  useEffect(() => {
    let gridTimer = 0
    let fullTimer = 0

    gridTimer = window.setTimeout(() => {
      setSceneLayer(2)
      fullTimer = window.setTimeout(() => {
        setSceneLayer(3)
      }, 76)
    }, 24)

    return () => {
      window.clearTimeout(gridTimer)
      window.clearTimeout(fullTimer)
    }
  }, [slug])

  const crossLinks = (scene?.crossLinks ?? [])
    .map((entry) => getDimensionBySlug(entry))
    .filter((entry): entry is NonNullable<typeof entry> => entry !== undefined)

  const hiddenRoute = dimensions.find((entry) => entry.hidden)
  const sceneTitle = scene ? pickLocalized(scene.title, language) : ''
  const sceneCoordinate = scene ? pickLocalized(scene.coordinate, language) : ''
  const sceneSignal = scene ? pickLocalized(scene.signal, language) : ''
  const sceneConcept = scene
    ? pickLocalized(dimensionConceptCopy[scene.slug as DimensionSlug], language)
    : ''
  const archiveIntro = scene
    ? pickLocalized(dimensionArchiveIntroCopy[scene.slug as DimensionSlug], language)
    : ''
  const archiveLabel = pickLocalized(interfaceCopy.sceneArchiveLabel, language)
  const conceptLabel = pickLocalized(interfaceCopy.sceneConceptLabel, language)
  const driftLabel = pickLocalized(interfaceCopy.driftLabel, language)
  const hiddenRouteLabel = pickLocalized(interfaceCopy.hiddenRoute, language)
  const returnHomeLabel = pickLocalized(interfaceCopy.returnHome, language)
  const ambientCloud = scene ? pickLocalizedList(scene.ambientWords, language) : []
  const visualCloud = scene ? pickLocalizedList(scene.visualMotifs, language) : []
  const interactionCloud = scene ? pickLocalizedList(scene.interactionMotifs, language) : []
  const internetCloud = scene ? pickLocalizedList(scene.internetArtifacts, language) : []
  const physicalCloud = scene ? pickLocalizedList(scene.physicalArtifacts, language) : []
  const archiveTracks = [
    { id: 'visual', label: interfaceCopy.visualLabel, words: visualCloud },
    { id: 'interaction', label: interfaceCopy.interactionLabel, words: interactionCloud },
    { id: 'internet', label: interfaceCopy.internetLabel, words: internetCloud },
    { id: 'physical', label: interfaceCopy.physicalLabel, words: physicalCloud },
  ]

  const candidates = [
    { id: 'still', path: scene?.media.still },
    { id: 'illustration', path: scene?.media.illustration },
    { id: 'relic', path: scene?.media.relic },
  ]
  const heroArtifacts = candidates
    .filter(
      (entry, index, array): entry is { id: string; path: string } =>
        Boolean(entry.path) &&
        array.findIndex((candidate) => candidate.path === entry.path) === index,
    )
    .slice(0, 2)

  useEffect(() => {
    if (!scene) {
      return
    }

    const linkedSources = scene.crossLinks
      .map((entry) => getDimensionBySlug(entry))
      .filter((entry): entry is NonNullable<typeof entry> => entry !== undefined)
      .flatMap((dimension) =>
        [
          dimension.media.still,
          dimension.media.texture,
          dimension.media.overlay,
          dimension.media.relic,
        ].filter((path): path is string => Boolean(path)),
      )

    const warmSources = Array.from(
      new Set(
        [
          scene.media.texture,
          scene.media.overlay,
          scene.media.relic,
          scene.media.illustration,
          ...linkedSources,
        ].filter((path): path is string => Boolean(path)),
      ),
    )

    return scheduleMediaWarmup(buildMediaQueue(warmSources, performanceProfile), {
      delay: scene.tone === 'error' ? 220 : 140,
      timeout: 1600,
    })
  }, [performanceProfile, scene])

  if (!scene) {
    return <Navigate replace to="/" />
  }

  return (
    <div
      className={`page dimension-page dimension-page--${scene.tone} ${
        sceneLayer >= 2 ? 'dimension-page--grid-ready' : ''
      } ${sceneLayer >= 3 ? 'dimension-page--full-ready' : ''}`}
    >
      <div className="dimension-page__backdrop" aria-hidden="true">
        <MediaSurface className="dimension-page__still" path={scene.media.still} />
        <MediaSurface className="dimension-page__texture" path={scene.media.texture} staticFallback={scene.media.still} />
        {scene.media.overlay ? (
          <MediaSurface className="dimension-page__overlay" path={scene.media.overlay} staticFallback={scene.media.still} />
        ) : null}
        {scene.media.relic ? (
          <MediaSurface className="dimension-page__relic" path={scene.media.relic} staticFallback={scene.media.illustration ?? scene.media.still} />
        ) : null}
      </div>

      {scene.tone === 'soviet' && performanceProfile.allowHeavyMotion ? (
        <div className="dimension-page__cyrillic-field" aria-hidden="true">
          {sovietGlitchWords.map((word) => (
            <span data-text={word} key={word}>
              {word}
            </span>
          ))}
        </div>
      ) : null}

      {scene.tone === 'error' ? (
        <div className="error-shrine-field" aria-hidden="true">
          <AdaptiveMedia className="error-shrine-field__layer error-shrine-field__layer--a" path="/media/uploaded/error-shrine-connected.jpg" />
          <AdaptiveMedia className="error-shrine-field__layer error-shrine-field__layer--b" path="/media/uploaded/error-shrine-green-face.jpg" />
          <AdaptiveMedia className="error-shrine-field__layer error-shrine-field__layer--d" path="/media/uploaded/error-shrine-signal-hand.jpg" />
          {performanceProfile.allowHeavyMotion ? (
            <AdaptiveMedia className="error-shrine-field__glitch" path="/media/ian-glitch-installation.gif" staticFallback="/media/ian-glitch-still.png" />
          ) : null}
          <span className="error-shrine-field__core"></span>
          <span className="error-shrine-field__scan"></span>
        </div>
      ) : null}

      <section className="dimension-hero">
        <div className="dimension-hero__copy">
          <span className="dimension-hero__micro" data-ghost-text={sceneCoordinate}>
            {sceneCoordinate}
          </span>
          <h1>
            {fragmentText(sceneTitle).map((part, index) => (
              <span data-ghost-text={part} key={`${part}-${index}`}>{part}</span>
            ))}
          </h1>
          <div className="dimension-hero__signal-stack">
            <p className="is-active">
              {fragmentText(sceneSignal).map((part, index) => (
                <span data-ghost-text={part} key={`${part}-${index}`}>{part}</span>
              ))}
            </p>
          </div>
          <article className="scene-concept">
            <small data-ghost-text={conceptLabel}>{conceptLabel}</small>
            <p>{sceneConcept}</p>
          </article>
          <div className="dimension-hero__ambient" aria-hidden="true">
            {ambientCloud.map((value, index) => (
              <span data-ghost-text={value} key={`${value}-${index}`}>{value}</span>
            ))}
          </div>
        </div>

        <div className="dimension-hero__media">
          <div className="dimension-hero__stack">
            <MediaSurface className="dimension-hero__texture-halo" path={scene.media.texture} />
            {heroArtifacts.map((artifact, index) => (
              <button
                aria-label={`${sceneTitle} ${artifact.id}`}
                aria-pressed={activeArtifact === index}
                className={`dimension-hero__artifact ${
                  activeArtifact === index ? 'is-active' : ''
                } ${hoveredArtifact === index ? 'is-hovered' : ''} ${
                  hoveredArtifact === index || activeArtifact === index ? 'is-priority' : ''
                }`}
                data-artifact={artifact.id}
                key={artifact.id}
                onBlur={() => setHoveredArtifact((current) => (current === index ? null : current))}
                onClick={() => setActiveArtifact(index)}
                onFocus={() => setHoveredArtifact(index)}
                onMouseEnter={() => setHoveredArtifact(index)}
                onMouseLeave={() => setHoveredArtifact((current) => (current === index ? null : current))}
                type="button"
              >
                <MediaSurface className="dimension-hero__asset" staticFallback={scene.media.still} path={artifact.path} />
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className={`dimension-grid section-reveal ${sceneLayer >= 2 ? 'section-reveal--shown' : ''}`}>
        <div className="section-heading">
          <span data-ghost-text={archiveLabel}>{archiveLabel}</span>
        </div>
        <p className="dimension-archive__intro">{archiveIntro}</p>
        <div className="dimension-archive">
          {archiveTracks.map((track) => (
            <article className="dimension-archive__track" key={track.id}>
              <h2 data-ghost-text={pickLocalized(track.label, language)}>{pickLocalized(track.label, language)}</h2>
              <div className="dimension-archive__tags">
                {track.words.map((value, wordIndex) => (
                  <i data-ghost-text={value} key={`${value}-${wordIndex}`}>{value}</i>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={`dimension-drift section-reveal ${sceneLayer >= 3 ? 'section-reveal--shown' : ''}`}>
        <div className="section-heading">
          <span data-ghost-text={driftLabel}>{driftLabel}</span>
        </div>
        <div className="dimension-drift__routes">
          {crossLinks.map((dimension) => (
            <SceneCard compact key={dimension.slug} language={language} scene={dimension} />
          ))}
          {hiddenRoute && hiddenRoute.slug !== scene.slug ? (
            <Link className="dimension-drift__fault xp-button xp-button--mini" data-ghost-text={hiddenRouteLabel} to={hiddenRoute.path}>
              {hiddenRouteLabel}
            </Link>
          ) : null}
          <Link className="dimension-drift__home xp-button xp-button--mini" data-ghost-text={returnHomeLabel} to="/">
            {returnHomeLabel}
          </Link>
        </div>
      </section>

      <section className="dimension-echo" aria-hidden="true">
        {pickLocalizedList(scene.overlayWords, language).map((word) => (
          <span data-ghost-text={word} key={word}>{word}</span>
        ))}
      </section>
    </div>
  )
}
