import type { CSSProperties } from 'react'
import { Suspense, useEffect, useRef, useState } from 'react'
import { BrowserRouter, HashRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { LocaleProvider } from './context/LocaleContext'
import { PerformanceProvider } from './context/PerformanceContext'
import { usePerformanceProfile } from './context/usePerformanceProfile'
import { getDimensionByPath, homePalette } from './data/scenes'
import AdaptiveMedia from './components/AdaptiveMedia'
import SignalHeader from './components/SignalHeader'
import XpCursor from './components/XpCursor'
import { shouldUseHashRouting } from './lib/performance'
import { HomeExperienceRoute, ThemeSceneRoute } from './lib/routeModules'

type RouteTone = 'home' | 'dreamfield' | 'browser' | 'bedroom' | 'pool' | 'mall' | 'backrooms' | 'soviet' | 'error'

function getRouteTone(pathname: string): RouteTone {
  return getDimensionByPath(pathname)?.tone ?? 'home'
}

function getTransitionProfile(from: RouteTone, to: RouteTone) {
  if (to === 'error' || from === 'error') {
    return { leave: 180, swap: 110, enter: 420, blur: '18px' }
  }

  if (to === 'dreamfield' || to === 'pool') {
    return { leave: 136, swap: 84, enter: 250, blur: '14px' }
  }

  if (to === 'browser') {
    return { leave: 128, swap: 76, enter: 230, blur: '11px' }
  }

  if (to === 'backrooms' || to === 'soviet') {
    return { leave: 138, swap: 86, enter: 240, blur: '10px' }
  }

  return { leave: 120, swap: 72, enter: 220, blur: '10px' }
}

function AppFrame() {
  const performanceProfile = usePerformanceProfile()
  const location = useLocation()
  const locationPathname = location.pathname
  const locationSearch = location.search
  const locationState = location.state
  const [displayLocation, setDisplayLocation] = useState(location)
  const [routePhase, setRoutePhase] = useState<'steady' | 'leaving' | 'entering'>('steady')
  const displayLocationRef = useRef(location)
  const [routeSignature, setRouteSignature] = useState<{ from: RouteTone; to: RouteTone }>({
    from: getRouteTone(location.pathname),
    to: getRouteTone(location.pathname),
  })
  const [transitionProfile, setTransitionProfile] = useState(
    getTransitionProfile(getRouteTone(location.pathname), getRouteTone(location.pathname)),
  )
  const phaseFrameRef = useRef<number | null>(null)
  const leaveTimerRef = useRef<number | null>(null)
  const enterTimerRef = useRef<number | null>(null)
  const displayDimension = getDimensionByPath(displayLocation.pathname)
  const requestedDimension = getDimensionByPath(location.pathname)
  const activeDimension = displayDimension
  const palette = activeDimension?.palette ?? homePalette
  const routeTargetDimension = routePhase === 'steady'
    ? displayDimension
    : requestedDimension ?? displayDimension
  const routeTone = routePhase === 'steady' ? routeSignature.from : routeSignature.to
  const showRouteVeil = routePhase !== 'steady'

  useEffect(() => {
    return () => {
      if (leaveTimerRef.current) {
        window.clearTimeout(leaveTimerRef.current)
      }
      if (enterTimerRef.current) {
        window.clearTimeout(enterTimerRef.current)
      }
      if (phaseFrameRef.current) {
        window.cancelAnimationFrame(phaseFrameRef.current)
      }
    }
  }, [])

  useEffect(() => {
    const currentDisplay = displayLocationRef.current

    if (
      locationPathname === currentDisplay.pathname &&
      locationSearch === currentDisplay.search
    ) {
      return
    }

    if (leaveTimerRef.current) {
      window.clearTimeout(leaveTimerRef.current)
    }
    if (enterTimerRef.current) {
      window.clearTimeout(enterTimerRef.current)
    }

    const nextFrom = getRouteTone(currentDisplay.pathname)
    const nextTo = getRouteTone(locationPathname)
    const nextProfile = getTransitionProfile(nextFrom, nextTo)
    const nextLocation = {
      ...location,
      pathname: locationPathname,
      search: locationSearch,
      state: locationState,
    }

    phaseFrameRef.current = window.requestAnimationFrame(() => {
      setRouteSignature({ from: nextFrom, to: nextTo })
      setTransitionProfile(nextProfile)
      setRoutePhase('leaving')
    })

    leaveTimerRef.current = window.setTimeout(() => {
      displayLocationRef.current = nextLocation
      setDisplayLocation(nextLocation)
      setRoutePhase('entering')
      enterTimerRef.current = window.setTimeout(() => {
        setRouteSignature({ from: nextTo, to: nextTo })
        setTransitionProfile(getTransitionProfile(nextTo, nextTo))
        setRoutePhase('steady')
      }, nextProfile.enter)
    }, nextProfile.swap)

    return () => {
      if (phaseFrameRef.current) {
        window.cancelAnimationFrame(phaseFrameRef.current)
      }
      if (leaveTimerRef.current) {
        window.clearTimeout(leaveTimerRef.current)
      }
      if (enterTimerRef.current) {
        window.clearTimeout(enterTimerRef.current)
      }
    }
  }, [location, locationPathname, locationSearch, locationState])

  const shellStyle = {
    '--tone-a': palette[0],
    '--tone-b': palette[1],
    '--tone-c': palette[2],
    '--tone-d': palette[3],
    '--route-leave-ms': `${transitionProfile.leave}ms`,
    '--route-enter-ms': `${transitionProfile.enter}ms`,
    '--route-blur': transitionProfile.blur,
  } as CSSProperties

  return (
    <div
      className={`app-shell ${activeDimension ? `app-shell--${activeDimension.tone}` : 'app-shell--home'}`}
      style={shellStyle}
    >
      <div className="app-atmosphere" aria-hidden="true">
        <AdaptiveMedia
          autoPlay
          className="app-atmosphere__video"
          forceStatic={!performanceProfile.allowAmbientVideo}
          loop
          muted
          path="/media/ian-main-hero.mp4"
          poster="/media/ian-main-hero-poster.png"
          preload={performanceProfile.allowAmbientVideo ? 'metadata' : 'none'}
        />
        {performanceProfile.allowHeavyMotion ? (
          <AdaptiveMedia
            className="app-atmosphere__noise"
            path="/media/ian-noise-veil.gif"
            staticFallback="/media/ian-main-hero-poster.png"
          />
        ) : null}
        {performanceProfile.allowHeavyMotion ? (
          <AdaptiveMedia
            className="app-atmosphere__ghost"
            path={activeDimension?.media.overlay ?? '/media/ian-glitch-still.png'}
            staticFallback={activeDimension?.media.still ?? '/media/ian-glitch-still.png'}
          />
        ) : null}
        {activeDimension ? (
          <AdaptiveMedia
            className="app-atmosphere__scene"
            path={activeDimension.media.still}
          />
        ) : null}
      </div>
      <div
        aria-hidden="true"
        className={`route-veil route-veil--${routePhase} route-veil--from-${routeSignature.from} route-veil--to-${routeSignature.to}`}
      >
        {showRouteVeil ? (
          <>
            <AdaptiveMedia
              className="route-veil__noise"
              forceStatic={!performanceProfile.allowHeavyMotion}
              loading="lazy"
              path={routeTone === 'error' ? '/media/222.gif' : '/media/111.gif'}
              staticFallback="/media/ian-glitch-still.png"
            />
            <AdaptiveMedia
              className="route-veil__ghost"
              loading="lazy"
              path={routeTargetDimension?.media.overlay ?? routeTargetDimension?.media.relic ?? '/media/222.gif'}
              staticFallback={routeTargetDimension?.media.still ?? '/media/ian-glitch-still.png'}
            />
            <AdaptiveMedia
              className="route-veil__still"
              loading="lazy"
              path={routeTargetDimension?.media.still ?? '/media/ian-glitch-still.png'}
            />
          </>
        ) : null}
      </div>

      <SignalHeader activeDimension={activeDimension} />
      <XpCursor />

      <main className={`app-main app-main--${routePhase} app-main--to-${routeSignature.to}`}>
        <Suspense fallback={<div className="page page--route-fallback" aria-hidden="true"></div>}>
          <Routes location={displayLocation}>
            <Route path="/" element={<HomeExperienceRoute />} />
            <Route path="/:slug" element={<ThemeSceneRoute key={displayLocation.pathname} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>

      <div className="dreamcore-veil" aria-hidden="true">
        <div className="dreamcore-veil__mist" />
        <div className="dreamcore-veil__bloom" />
        <div className="dreamcore-veil__glass" />
      </div>
    </div>
  )
}

function App() {
  const Router = shouldUseHashRouting() ? HashRouter : BrowserRouter

  return (
    <PerformanceProvider>
      <LocaleProvider>
        <Router>
          <AppFrame />
        </Router>
      </LocaleProvider>
    </PerformanceProvider>
  )
}

export default App
