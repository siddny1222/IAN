import { useEffect, useRef, useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import AdaptiveMedia from './AdaptiveMedia'
import { usePerformanceProfile } from '../context/usePerformanceProfile'
import { withBase } from '../lib/performance'
import {
  fragmentText,
  interfaceCopy,
  languages,
  type Language,
} from '../data/scenes'

type BootCurtainProps = {
  language: Language
  loadingSources: string[]
  onEnter: () => void
  phase: 'closed' | 'opening' | 'open'
}

export default function BootCurtain({
  language,
  loadingSources,
  onEnter,
  phase,
}: BootCurtainProps) {
  const performanceProfile = usePerformanceProfile()
  const dialogRef = useRef<HTMLDivElement>(null)
  const pointerStartYRef = useRef<number | null>(null)
  const [loadedCount, setLoadedCount] = useState(0)
  const [assetsReady, setAssetsReady] = useState(false)
  const [progress, setProgress] = useState(0)
  const totalSources = Math.max(loadingSources.length + 1, 1)
  const ready = assetsReady && progress >= 100 && phase === 'closed'
  const progressLabel = `${progress.toString().padStart(3, '0')}%`
  const statusLabel = ready
    ? interfaceCopy.bootReady[language]
    : `${progress.toString().padStart(3, '0')}% / ${loadedCount.toString().padStart(2, '0')} / ${totalSources.toString().padStart(2, '0')}`

  const handleEnter = useCallback(() => {
    if (!ready) {
      return
    }

    onEnter()
  }, [ready, onEnter])

  const handleEnterRef = useRef(handleEnter)
  useEffect(() => {
    handleEnterRef.current = handleEnter
  }, [handleEnter])

  useEffect(() => {
    if (phase === 'closed') {
      dialogRef.current?.focus()
    }
  }, [phase])

  useEffect(() => {
    if (phase === 'open') return
    const el = dialogRef.current
    if (!el) return

    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) > 18) {
        event.preventDefault()
        handleEnterRef.current()
      }
    }

    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [phase])

  useEffect(() => {
    if (phase !== 'closed') {
      return
    }

    let completed = 0
    let cancelled = false
    let settleTimer = 0
    const cleanupFns: Array<() => void> = []
    const startedAt = performance.now()
    const minimumDuration = 1400

    const finishIfReady = () => {
      if (completed < totalSources) {
        return
      }

      const remaining = Math.max(0, minimumDuration - (performance.now() - startedAt))
      settleTimer = window.setTimeout(() => {
        if (cancelled) {
          return
        }

        setLoadedCount(totalSources)
        setProgress(100)
        setAssetsReady(true)
      }, remaining)
    }

    const markLoaded = () => {
      if (cancelled) {
        return
      }

      completed += 1
      const assetRatio = completed / totalSources
      const elapsedRatio = Math.min((performance.now() - startedAt) / minimumDuration, 1)
      const blendedProgress = completed === totalSources
        ? 100
        : Math.min(96, Math.round(assetRatio * 88 + elapsedRatio * 12))

      setLoadedCount(completed)
      setProgress((current) => (blendedProgress > current ? blendedProgress : current))
      finishIfReady()
    }

    const once = (callback: () => void) => {
      let called = false
      return () => {
        if (called) {
          return
        }

        called = true
        callback()
      }
    }

    const systemReady = once(markLoaded)
    if (document.readyState === 'complete') {
      window.setTimeout(systemReady, 0)
    } else {
      window.addEventListener('load', systemReady, { once: true })
      cleanupFns.push(() => window.removeEventListener('load', systemReady))
    }

    loadingSources.forEach((source) => {
      const done = once(markLoaded)
      const isVideo = /\.(mp4|mov|webm)$/i.test(source)

      if (isVideo) {
        const video = document.createElement('video')
        const handleDone = () => done()
        video.preload = 'auto'
        video.muted = true
        video.playsInline = true
        video.src = withBase(source)
        video.addEventListener('loadeddata', handleDone, { once: true })
        video.addEventListener('canplay', handleDone, { once: true })
        video.addEventListener('error', handleDone, { once: true })
        video.load()

        if (video.readyState >= 2) {
          window.setTimeout(handleDone, 0)
        }

        cleanupFns.push(() => {
          video.removeEventListener('loadeddata', handleDone)
          video.removeEventListener('canplay', handleDone)
          video.removeEventListener('error', handleDone)
          video.src = ''
        })

        return
      }

      const image = new Image()
      const handleDone = () => done()
      image.onload = handleDone
      image.onerror = handleDone
      image.src = withBase(source)

      if (image.complete) {
        window.setTimeout(handleDone, 0)
      }

      cleanupFns.push(() => {
        image.onload = null
        image.onerror = null
      })
    })

    return () => {
      cancelled = true
      window.clearTimeout(settleTimer)
      cleanupFns.forEach((cleanup) => cleanup())
    }
  }, [loadingSources, phase, totalSources])

  if (phase === 'open' || typeof document === 'undefined') {
    return null
  }

  return createPortal(
    <div
      aria-label={interfaceCopy.bootStamp[language]}
      aria-modal="true"
      className={`boot-curtain boot-curtain--${phase}`}
      ref={dialogRef}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowUp') {
          event.preventDefault()
          handleEnter()
        }
      }}
      onPointerDown={(event) => {
        pointerStartYRef.current = event.clientY
      }}
      onPointerUp={(event) => {
        const startY = pointerStartYRef.current
        pointerStartYRef.current = null

        if (startY === null) {
          return
        }

        if (startY - event.clientY > 86) {
          handleEnter()
        }
      }}
      role="dialog"
      tabIndex={0}
    >
      <AdaptiveMedia
        autoPlay
        className="boot-curtain__video"
        fetchpriority="high"
        forceStatic={!performanceProfile.allowAmbientVideo}
        loop
        muted
        path="/media/ian-main-hero.mp4"
        poster="/media/ian-main-hero-poster.png"
        preload={performanceProfile.allowAmbientVideo ? 'metadata' : 'none'}
      />
      {performanceProfile.allowHeavyMotion ? (
        <AdaptiveMedia
          className="boot-curtain__noise"
          path="/media/ian-noise-veil.gif"
          staticFallback="/media/ian-main-hero-poster.png"
        />
      ) : null}
      {performanceProfile.allowHeavyMotion ? (
        <AdaptiveMedia
          className="boot-curtain__ghost-film"
          path="/media/222.gif"
          staticFallback="/media/ian-glitch-still.png"
        />
      ) : null}
      <div className="boot-curtain__veil" aria-hidden="true"></div>

      <div className="boot-curtain__copy">
        <div className="boot-curtain__status-row">
          <span className="boot-curtain__stamp" data-ghost-text={interfaceCopy.bootStamp[language]}>
            {interfaceCopy.bootStamp[language]}
          </span>
          <span className="boot-curtain__progress" data-ghost-text={progressLabel}>{progressLabel}</span>
        </div>

        <div className="boot-curtain__center">
          <div className="boot-curtain__polyglot" aria-hidden="true">
            {languages.map((entry) => (
              <span data-language={entry} key={entry}>
                {fragmentText(interfaceCopy.homeSignal[entry]).map((part, index) => (
                  <i data-ghost-text={part} key={`${entry}-${part}-${index}`}>{part}</i>
                ))}
              </span>
            ))}
          </div>

          <h2>
            {['I', 'A', 'N'].map((letter) => (
              <span data-ghost-text={letter} key={letter}>{letter}</span>
            ))}
          </h2>

          <div className="boot-curtain__whispers">
            {languages.map((entry) => (
              <p data-language={entry} key={entry}>
                {fragmentText(interfaceCopy.homeWhisper[entry]).map((part, index) => (
                  <span data-ghost-text={part} key={`${entry}-${part}-${index}`}>{part}</span>
                ))}
              </p>
            ))}
          </div>
        </div>

        <div className="boot-curtain__actions">
          <button
            className="boot-curtain__button xp-button xp-button--hero"
            disabled={!ready}
            onClick={handleEnter}
            type="button"
          >
            {fragmentText(interfaceCopy.enter[language]).map((part, index) => (
              <span data-ghost-text={part} key={`${part}-${index}`}>{part}</span>
            ))}
          </button>
          <span className="boot-curtain__fake-load" aria-live="polite" data-ghost-text={statusLabel}>
            {statusLabel}
          </span>
        </div>
      </div>
    </div>,
    document.body,
  )
}
