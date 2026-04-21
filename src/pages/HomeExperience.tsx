import type { CSSProperties } from 'react'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import AdaptiveMedia from '../components/AdaptiveMedia'
import BootCurtain from '../components/BootCurtain'
import SceneCard from '../components/SceneCard'
import { usePerformanceProfile } from '../context/usePerformanceProfile'
import { useLocale } from '../context/useLocale'
import { primeMedia, scheduleMediaWarmup } from '../lib/mediaLoader'
import { buildMediaQueue } from '../lib/performance'
import { primeThemeSceneRoute } from '../lib/routeModules'
import {
  assetArchiveById,
  dimensions,
  fragmentText,
  homeAxes,
  homeArchiveCollageIds,
  homeGhostWords,
  interfaceCopy,
  pickLocalized,
  pickLocalizedList,
  visibleDimensions,
  type ArchiveAsset,
  type Dimension,
} from '../data/scenes'

function AssetPreview({ active, asset }: { active: boolean; asset: ArchiveAsset }) {
  const mediaClass = /icon|logo|sticker|bliss/i.test(asset.path)
    ? 'asset-fragment__media is-contained'
    : 'asset-fragment__media'

  return (
    <AdaptiveMedia
      className={mediaClass}
      forceStatic={!active}
      loading="lazy"
      path={asset.path}
      preload={active ? 'metadata' : 'none'}
      staticFallback={asset.type === 'video' ? '/media/ian-main-hero-poster.png' : undefined}
    />
  )
}

const archivePlacements = [
  { x: '1%', y: '3%', w: '23%', h: '29%', rotate: -8, depth: 4 },
  { x: '18%', y: '0%', w: '17%', h: '18%', rotate: 9, depth: 6 },
  { x: '33%', y: '4%', w: '22%', h: '26%', rotate: -4, depth: 5 },
  { x: '53%', y: '1%', w: '16%', h: '20%', rotate: 10, depth: 7 },
  { x: '66%', y: '5%', w: '20%', h: '24%', rotate: -6, depth: 8 },
  { x: '80%', y: '10%', w: '15%', h: '18%', rotate: 7, depth: 4 },
  { x: '7%', y: '27%', w: '18%', h: '24%', rotate: 5, depth: 7 },
  { x: '24%', y: '24%', w: '24%', h: '31%', rotate: -9, depth: 10 },
  { x: '47%', y: '28%', w: '18%', h: '22%', rotate: 6, depth: 6 },
  { x: '61%', y: '25%', w: '24%', h: '31%', rotate: -5, depth: 11 },
  { x: '16%', y: '52%', w: '27%', h: '24%', rotate: -5, depth: 8 },
  { x: '47%', y: '48%', w: '31%', h: '27%', rotate: 4, depth: 12 },
] as const

const curtainLoadingSources = Array.from(
  new Set(
    [
      '/media/ian-main-hero.mp4',
      '/media/ian-main-hero-poster.png',
      '/media/ian-noise-veil.gif',
      ...visibleDimensions.flatMap((scene) =>
        [scene.media.still].filter((path): path is string => Boolean(path)),
      ),
    ],
  ),
)

const deferredHomeLoadingSources = Array.from(
  new Set(
    [
      '/media/111.gif',
      '/media/222.gif',
      ...visibleDimensions.flatMap((scene) =>
        [
          scene.media.texture,
          scene.media.overlay,
          scene.media.relic,
          scene.media.illustration,
        ].filter((path): path is string => Boolean(path)),
      ),
      ...dimensions.flatMap((scene) =>
        [scene.media.still, scene.media.texture, scene.media.overlay, scene.media.relic].filter(
          (path): path is string => Boolean(path),
        ),
      ),
      ...homeArchiveCollageIds
        .map((id) => assetArchiveById.get(id)?.path)
        .filter((path): path is string => Boolean(path)),
    ],
  ),
)

const CURTAIN_SESSION_KEY = 'ian.curtain.opened'

function hasOpenedCurtainThisSession() {
  return typeof sessionStorage !== 'undefined' && sessionStorage.getItem(CURTAIN_SESSION_KEY) === '1'
}

export default function HomeExperience() {
  const navigate = useNavigate()
  const location = useLocation()
  const performanceProfile = usePerformanceProfile()
  const { language } = useLocale()
  const previewOpen = new URLSearchParams(location.search).get('preview') === 'open'
  const [curtainPhase, setCurtainPhase] = useState<'closed' | 'opening' | 'open'>(() =>
    previewOpen || hasOpenedCurtainThisSession() ? 'open' : 'closed',
  )
  const [homeLayer, setHomeLayer] = useState<0 | 1 | 2 | 3>(() =>
    previewOpen || hasOpenedCurtainThisSession() ? 1 : 0,
  )
  const [launchingScene, setLaunchingScene] = useState<Dimension | null>(null)
  const showExperience = curtainPhase !== 'closed'

  const hiddenScene = dimensions.find((dimension) => dimension.hidden)
  const featuredArchive = homeArchiveCollageIds
    .map((id) => assetArchiveById.get(id))
    .filter((asset): asset is ArchiveAsset => Boolean(asset))
  const [activeArchive, setActiveArchive] = useState<string | null>(featuredArchive[0]?.id ?? null)
  const homeSignal = pickLocalized(interfaceCopy.homeSignal, language)
  const homeWhisperParts = fragmentText(pickLocalized(interfaceCopy.homeWhisper, language))
  const axesLabel = pickLocalized(interfaceCopy.axesLabel, language)
  const exploreStartLabel = pickLocalized(interfaceCopy.exploreStart, language)
  const curtainSources = buildMediaQueue(curtainLoadingSources, performanceProfile, {
    includeHighCost: performanceProfile.allowAmbientVideo,
    limit: performanceProfile.allowAmbientVideo ? 10 : 6,
  })

  useEffect(() => {
    document.body.classList.toggle('curtain-active', curtainPhase !== 'open')

    return () => {
      document.body.classList.remove('curtain-active')
    }
  }, [curtainPhase])

  useEffect(() => {
    if (!showExperience) {
      const resetTimer = window.setTimeout(() => {
        setHomeLayer(0)
      }, 0)

      return () => {
        window.clearTimeout(resetTimer)
      }
    }

    let stageTimer = 0
    let archiveTimer = 0
    let slicesTimer = 0

    stageTimer = window.setTimeout(() => {
      setHomeLayer(1)
    }, 0)
    archiveTimer = window.setTimeout(() => {
      setHomeLayer(2)
      slicesTimer = window.setTimeout(() => {
        setHomeLayer(3)
      }, 140)
    }, curtainPhase === 'opening' ? 420 : 120)

    return () => {
      window.clearTimeout(stageTimer)
      window.clearTimeout(archiveTimer)
      window.clearTimeout(slicesTimer)
    }
  }, [curtainPhase, showExperience])

  useEffect(() => {
    if (!showExperience) {
      return
    }

    void primeThemeSceneRoute()

    return scheduleMediaWarmup(buildMediaQueue(deferredHomeLoadingSources, performanceProfile), {
      delay: curtainPhase === 'opening' ? 520 : 180,
      timeout: 1800,
    })
  }, [curtainPhase, performanceProfile, showExperience])

  const launchScene = (scene: Dimension) => {
    if (launchingScene) {
      return
    }

    setLaunchingScene(scene)
    const routeWarmup = primeThemeSceneRoute()
    const warmup = primeMedia(buildMediaQueue([
      scene.media.still,
      scene.media.texture,
      scene.media.overlay,
      scene.media.relic,
      scene.media.illustration,
    ], performanceProfile, { includeHighCost: true, limit: 5 }))
    void Promise.race([
      Promise.all([routeWarmup, warmup]),
      new Promise((resolve) => {
        window.setTimeout(resolve, 380)
      }),
    ]).then(() => {
      navigate(scene.path, { state: { fromHub: true } })
    }).catch(() => {
      navigate(scene.path, { state: { fromHub: true } })
    })
  }

  const openCurtain = () => {
    if (curtainPhase !== 'closed') {
      return
    }

    sessionStorage.setItem(CURTAIN_SESSION_KEY, '1')
    setCurtainPhase('opening')
    window.setTimeout(() => {
      setCurtainPhase('open')
    }, 1120)
  }

  const hiddenRouteLabel = pickLocalized(interfaceCopy.hiddenRoute, language)
  const archiveLabel = pickLocalized(interfaceCopy.archiveLabel, language)
  const primeHiddenScene = hiddenScene
    ? () => void primeMedia(buildMediaQueue([
        hiddenScene.media.still,
        hiddenScene.media.texture,
        hiddenScene.media.overlay,
        hiddenScene.media.relic,
      ], performanceProfile, { limit: 4 }))
    : undefined

  if (!showExperience) {
    return (
      <div className="page page--home home-page home-page--curtain">
        <BootCurtain
          language={language}
          loadingSources={curtainSources}
          onEnter={openCurtain}
          phase={curtainPhase}
        />
      </div>
    )
  }

  return (
    <div
      className={`page page--home home-page ${
        curtainPhase === 'opening' ? 'home-page--opening' : ''
      } ${homeLayer >= 1 ? 'home-page--stage-ready' : ''} ${
        homeLayer >= 2 ? 'home-page--archive-ready' : ''
      } ${homeLayer >= 3 ? 'home-page--slices-ready' : ''}`}
    >
      <BootCurtain
        language={language}
        loadingSources={curtainSources}
        onEnter={openCurtain}
        phase={curtainPhase}
      />

      <section className="home-stage">
        <div className="home-stage__ghosts" aria-hidden="true">
          {homeGhostWords[language].map((word) => (
            <span data-ghost-text={word} key={word}>{word}</span>
          ))}
        </div>

        <div className="home-stage__intro">
          <p className="home-stage__micro" data-ghost-text={homeSignal}>
            {homeSignal}
          </p>
          <h1>
            {['I', 'A', 'N'].map((letter) => (
              <span data-ghost-text={letter} key={letter}>{letter}</span>
            ))}
          </h1>
          <p className="home-stage__whisper">
            {homeWhisperParts.map((part, index) => (
              <span data-ghost-text={part} key={`${part}-${index}`}>{part}</span>
            ))}
          </p>
          <button
            className="home-stage__start xp-button"
            onClick={() => launchScene(visibleDimensions[0])}
            type="button"
          >
            {exploreStartLabel}
          </button>
        </div>

        <div className="home-stage__axes">
          <span data-ghost-text={axesLabel}>{axesLabel}</span>
          {homeAxes[language].map((axis) => (
            <i data-ghost-text={axis} key={axis}>{axis}</i>
          ))}
        </div>

        <div className="home-stage__portals">
          {visibleDimensions.map((scene) => (
            <SceneCard
              disabled={Boolean(launchingScene)}
              key={scene.slug}
              language={language}
              onActivate={launchScene}
              scene={scene}
              style={
                {
                  '--portal-x': `${scene.homePosition.x}%`,
                  '--portal-y': `${scene.homePosition.y}%`,
                  '--portal-rotate': `${scene.homePosition.rotate}deg`,
                  '--portal-scale': scene.homePosition.scale,
                } as CSSProperties
              }
            />
          ))}

          {hiddenScene ? (
            <button
              className="home-stage__fault xp-button xp-button--mini"
              data-ghost-text={hiddenRouteLabel}
              onFocus={primeHiddenScene}
              onMouseEnter={primeHiddenScene}
              onTouchStart={primeHiddenScene}
              onClick={() => launchScene(hiddenScene)}
              type="button"
            >
              {hiddenRouteLabel}
            </button>
          ) : null}
        </div>
      </section>

      <section className="home-archive">
        <div className="section-heading">
          <span data-ghost-text={archiveLabel}>{archiveLabel}</span>
        </div>
        <div className="home-archive__board">
          {featuredArchive.map((asset, index) => {
            const placement = archivePlacements[index % archivePlacements.length]

            return (
              <button
                aria-label={pickLocalized(asset.label, language)}
                aria-pressed={activeArchive === asset.id}
                className={`asset-fragment asset-fragment--${asset.type} ${
                  activeArchive === asset.id ? 'is-active' : ''
                }`}
                data-tone={asset.tone}
                key={asset.id}
                onClick={() => setActiveArchive(asset.id)}
                onMouseEnter={() => setActiveArchive(asset.id)}
                style={
                  {
                    '--fragment-x': placement.x,
                    '--fragment-y': placement.y,
                    '--fragment-w': placement.w,
                    '--fragment-h': placement.h,
                    '--fragment-r': `${placement.rotate}deg`,
                    '--fragment-depth': placement.depth,
                  } as CSSProperties
                }
                type="button"
              >
                <AssetPreview active={activeArchive === asset.id} asset={asset} />
              </button>
            )
          })}
        </div>
      </section>

      <section className="home-slices">
        {visibleDimensions.map((scene) => (
          <article className={`dimension-slice dimension-slice--${scene.tone}`} key={scene.slug}>
            <div className="dimension-slice__media">
              <AdaptiveMedia className="" loading="lazy" path={scene.media.still} />
              <AdaptiveMedia className="" loading="lazy" path={scene.media.texture} />
            </div>
            <div className="dimension-slice__copy">
              <span data-ghost-text={pickLocalized(scene.microLabel, language)}>{pickLocalized(scene.microLabel, language)}</span>
              <h2>
                {fragmentText(pickLocalized(scene.title, language)).map((part, index) => (
                  <span data-ghost-text={part} key={`${part}-${index}`}>{part}</span>
                ))}
              </h2>
              <div className="dimension-slice__words" aria-hidden="true">
                {pickLocalizedList(scene.ambientWords, language).map((word) => (
                  <i data-ghost-text={word} key={word}>{word}</i>
                ))}
              </div>
            </div>
          </article>
        ))}
      </section>

      {launchingScene ? (
        <div className="launch-overlay" aria-hidden="true">
          <div className="launch-overlay__card" data-tone={launchingScene.tone}>
            <span data-ghost-text={pickLocalized(launchingScene.coordinate, language)}>{pickLocalized(launchingScene.coordinate, language)}</span>
            <strong>
              {fragmentText(pickLocalized(launchingScene.title, language)).map((part, index) => (
                <span data-ghost-text={part} key={`${part}-${index}`}>{part}</span>
              ))}
            </strong>
            <small data-ghost-text={pickLocalized(launchingScene.microLabel, language)}>{pickLocalized(launchingScene.microLabel, language)}</small>
          </div>
        </div>
      ) : null}
    </div>
  )
}
