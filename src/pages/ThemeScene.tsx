import { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import AdaptiveMedia from '../components/AdaptiveMedia'
import SceneCard from '../components/SceneCard'
import { usePerformanceProfile } from '../context/usePerformanceProfile'
import { useLocale } from '../context/useLocale'
import { scheduleMediaWarmup } from '../lib/mediaLoader'
import { buildMediaQueue } from '../lib/performance'
import { primeHomeExperienceRoute } from '../lib/routeModules'
import { useReveal } from '../lib/useReveal'
import {
  dimensionPanelMedia,
  dimensions,
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
  const [activePanelId, setActivePanelId] = useState<string | null>(null)
  const gridReveal = useReveal<HTMLElement>({ threshold: 0.08 })
  const driftReveal = useReveal<HTMLElement>({ threshold: 0.12 })

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
  const driftLabel = pickLocalized(interfaceCopy.driftLabel, language)
  const hiddenRouteLabel = pickLocalized(interfaceCopy.hiddenRoute, language)
  const returnHomeLabel = pickLocalized(interfaceCopy.returnHome, language)
  const ambientCloud = scene ? pickLocalizedList(scene.ambientWords, language) : []
  const visualCloud = scene ? pickLocalizedList(scene.visualMotifs, language) : []
  const interactionCloud = scene ? pickLocalizedList(scene.interactionMotifs, language) : []
  const internetCloud = scene ? pickLocalizedList(scene.internetArtifacts, language) : []
  const physicalCloud = scene ? pickLocalizedList(scene.physicalArtifacts, language) : []
  const panelMedia = scene
    ? dimensionPanelMedia[scene.slug]
    : { visual: [], interaction: [], internet: [], physical: [] }
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
    .slice(0, 3)
  const panelDeck = [
    {
      id: 'visual',
      label: interfaceCopy.visualLabel,
      media: panelMedia.visual,
      words: visualCloud,
    },
    {
      id: 'interaction',
      label: interfaceCopy.interactionLabel,
      media: panelMedia.interaction,
      words: interactionCloud,
    },
    {
      id: 'internet',
      label: interfaceCopy.internetLabel,
      media: panelMedia.internet,
      words: internetCloud,
    },
    {
      id: 'physical',
      label: interfaceCopy.physicalLabel,
      media: panelMedia.physical,
      words: physicalCloud,
    },
  ]
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
    const localPanels = dimensionPanelMedia[scene.slug]
    const warmSources = Array.from(
      new Set(
        [
          scene.media.texture,
          scene.media.overlay,
          scene.media.relic,
          scene.media.illustration,
          ...localPanels.visual,
          ...localPanels.interaction,
          ...localPanels.internet,
          ...localPanels.physical,
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
          <AdaptiveMedia
            className="error-shrine-field__layer error-shrine-field__layer--a"
            path="/media/uploaded/error-shrine-connected.jpg"
          />
          <AdaptiveMedia
            className="error-shrine-field__layer error-shrine-field__layer--b"
            path="/media/uploaded/error-shrine-green-face.jpg"
          />
          <AdaptiveMedia
            className="error-shrine-field__layer error-shrine-field__layer--c"
            path="/media/uploaded/error-shrine-shadow-monitor.jpg"
          />
          <AdaptiveMedia
            className="error-shrine-field__layer error-shrine-field__layer--d"
            path="/media/uploaded/error-shrine-signal-hand.jpg"
          />
          <AdaptiveMedia
            className="error-shrine-field__layer error-shrine-field__layer--e"
            path="/media/uploaded/error-shrine-blue-tv.jpg"
          />
          {performanceProfile.allowHeavyMotion ? (
            <>
              <AdaptiveMedia
                className="error-shrine-field__noise"
                path="/media/111.gif"
                staticFallback="/media/ian-glitch-still.png"
              />
              <AdaptiveMedia
                className="error-shrine-field__noise error-shrine-field__noise--alt"
                path="/media/222.gif"
                staticFallback="/media/ian-glitch-still.png"
              />
              <AdaptiveMedia
                className="error-shrine-field__glitch"
                path="/media/ian-glitch-installation.gif"
                staticFallback="/media/ian-glitch-still.png"
              />
            </>
          ) : null}
          <span className="error-shrine-field__core"></span>
          <span className="error-shrine-field__scan"></span>
          {performanceProfile.allowHeavyMotion ? (
            <>
              <span className="error-shrine-field__beam error-shrine-field__beam--left"></span>
              <span className="error-shrine-field__beam error-shrine-field__beam--right"></span>
            </>
          ) : null}
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
                <MediaSurface
                  className="dimension-hero__asset"
                  staticFallback={scene.media.still}
                  path={artifact.path}
                />
              </button>
            ))}
          </div>
        </div>
      </section>

      <section
        className={`dimension-grid section-reveal ${gridReveal.revealed ? 'section-reveal--shown' : ''}`}
        ref={gridReveal.ref}
      >
        <div className={`dimension-stack ${activePanelId ? 'has-active' : ''}`}>
          {panelDeck.map((panel, index) => (
            <button
              className={`dimension-panel dimension-panel--${panel.id} ${
                activePanelId === panel.id ? 'is-active' : ''
              }`}
              key={panel.id}
              onClick={() =>
                setActivePanelId((current) => (current === panel.id ? null : panel.id))
              }
              type="button"
            >
              <div className="dimension-panel__face dimension-panel__face--front">
                <div className="dimension-panel__media" aria-hidden="true">
                  {panel.media.slice(0, 3).map((path, mediaIndex) => (
                    <MediaSurface
                      className={`dimension-panel__asset dimension-panel__asset--${
                        mediaIndex === 0
                          ? 'primary'
                          : mediaIndex === 1
                            ? 'secondary'
                            : 'tertiary'
                      }`}
                      key={`${panel.id}-${path}-front`}
                      loading="lazy"
                      path={path}
                    />
                  ))}
                </div>
                <span data-ghost-text={pickLocalized(panel.label, language)}>{pickLocalized(panel.label, language)}</span>
                <strong data-ghost-text={String(index + 1).padStart(2, '0')}>{String(index + 1).padStart(2, '0')}</strong>
              </div>
              <div className="dimension-panel__face dimension-panel__face--back">
                <div className="dimension-panel__media dimension-panel__media--back" aria-hidden="true">
                  {panel.media.slice(0, 3).reverse().map((path, mediaIndex) => (
                    <MediaSurface
                      className={`dimension-panel__asset dimension-panel__asset--${
                        mediaIndex === 0
                          ? 'primary'
                          : mediaIndex === 1
                            ? 'secondary'
                            : 'tertiary'
                      }`}
                      key={`${panel.id}-${path}-back`}
                      loading="lazy"
                      path={path}
                    />
                  ))}
                </div>
                <span data-ghost-text={pickLocalized(panel.label, language)}>{pickLocalized(panel.label, language)}</span>
                <div className="dimension-panel__words">
                  {panel.words.map((value, wordIndex) => (
                    <i data-ghost-text={value} key={`${value}-${wordIndex}`}>{value}</i>
                  ))}
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section
        className={`dimension-drift section-reveal ${driftReveal.revealed ? 'section-reveal--shown' : ''}`}
        ref={driftReveal.ref}
      >
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
