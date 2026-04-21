import type { CSSProperties } from 'react'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import AdaptiveMedia from '../components/AdaptiveMedia'
import BootCurtain from '../components/BootCurtain'
import SceneCard from '../components/SceneCard'
import SplitFogText from '../components/SplitFogText'
import { usePerformanceProfile } from '../context/usePerformanceProfile'
import { useLocale } from '../context/useLocale'
import { primeMedia, scheduleMediaWarmup } from '../lib/mediaLoader'
import { buildMediaQueue } from '../lib/performance'
import { primeThemeSceneRoute } from '../lib/routeModules'
import { runSoftMotion } from '../lib/softMotion'
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
  const [activeSlice, setActiveSlice] = useState(0)
  const showExperience = curtainPhase !== 'closed'

  const featuredArchive = homeArchiveCollageIds
    .map((id) => assetArchiveById.get(id))
    .filter((asset): asset is ArchiveAsset => Boolean(asset))
  const [activeArchive, setActiveArchive] = useState<string | null>(featuredArchive[0]?.id ?? null)
  const homeSignal = pickLocalized(interfaceCopy.homeSignal, language)
  const homeWhisperParts = fragmentText(pickLocalized(interfaceCopy.homeWhisper, language))
  const axesLabel = pickLocalized(interfaceCopy.axesLabel, language)
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
    if (!showExperience || !performanceProfile.allowHeavyMotion || performanceProfile.prefersReducedMotion) {
      return
    }
    return runSoftMotion([
      {
        selector: '.home-stage__intro',
        keyframes: [{ opacity: 0, transform: 'translateY(14px)' }, { opacity: 1, transform: 'translateY(0px)' }],
        options: { duration: 580, easing: 'cubic-bezier(0.22,1,0.36,1)', fill: 'both' },
      },
      {
        selector: '.home-stage__axes',
        keyframes: [{ opacity: 0, transform: 'translateX(12px)' }, { opacity: 1, transform: 'translateX(0px)' }],
        options: { duration: 420, easing: 'cubic-bezier(0.22,1,0.36,1)', fill: 'both', delay: 120 },
      },
      {
        selector: '.home-stage__portals .scene-card',
        keyframes: [{ opacity: 0, transform: 'translateY(12px) scale(0.98)' }, { opacity: 1, transform: 'translateY(0px) scale(1)' }],
        options: { duration: 560, easing: 'cubic-bezier(0.22,1,0.36,1)', fill: 'both', delay: 180 },
        staggerMs: 45,
      },
    ])
  }, [
    performanceProfile.allowHeavyMotion,
    performanceProfile.prefersReducedMotion,
    showExperience,
  ])

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

  useEffect(() => {
    if (!showExperience) {
      return
    }

    const autoplay = window.setInterval(() => {
      setActiveSlice((current) => (current + 1) % visibleDimensions.length)
    }, 3600)

    return () => window.clearInterval(autoplay)
  }, [showExperience])

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

  const archiveLabel = pickLocalized(interfaceCopy.archiveLabel, language)

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

      <section className="home-overview home-overview--dual">
        <div className="home-stage home-overview__narrative">
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
              <SplitFogText text="IAN" />
            </h1>
            <p className="home-stage__whisper">
              {homeWhisperParts.map((part, index) => (
                <span data-ghost-text={part} key={`${part}-${index}`}>{part}</span>
              ))}
            </p>
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
          </div>
        </div>

        <section className="home-slices home-overview__carousel">
          <div className="home-slices__viewport">
            <div className="home-slices__track" style={{ transform: `translateX(-${activeSlice * 100}%)` }}>
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
            </div>
            <div className="home-slices__dots" aria-label="scene carousel">
              {visibleDimensions.map((scene, index) => (
                <button
                  aria-label={pickLocalized(scene.title, language)}
                  className={index === activeSlice ? 'is-active' : ''}
                  key={scene.slug}
                  onClick={() => setActiveSlice(index)}
                  type="button"
                />
              ))}
            </div>
          </div>
        </section>

        <section className="home-archive home-overview__archive">
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
