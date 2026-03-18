import { normalizeMediaPath, withBase } from './performance'

const mediaCache = new Map<string, Promise<void>>()

type IdleWindow = Window & {
  cancelIdleCallback?: (handle: number) => void
  requestIdleCallback?: (
    callback: () => void,
    options?: {
      timeout?: number
    },
  ) => number
}

function primeOne(path: string) {
  const normalizedPath = normalizeMediaPath(path)

  if (!normalizedPath) {
    return Promise.resolve()
  }

  if (mediaCache.has(normalizedPath)) {
    return mediaCache.get(normalizedPath)!
  }

  const task = new Promise<void>((resolve) => {
    const finish = () => resolve()
    const resolvedPath = withBase(normalizedPath)

    if (/\.(mp4|mov|webm)$/i.test(normalizedPath)) {
      const video = document.createElement('video')
      const done = () => {
        video.removeEventListener('loadeddata', done)
        video.removeEventListener('canplay', done)
        video.removeEventListener('error', done)
        video.src = ''
        finish()
      }

      video.preload = 'metadata'
      video.muted = true
      video.playsInline = true
      video.src = resolvedPath
      video.addEventListener('loadeddata', done, { once: true })
      video.addEventListener('canplay', done, { once: true })
      video.addEventListener('error', done, { once: true })
      video.load()

      if (video.readyState >= 2) {
        window.setTimeout(done, 0)
      }

      return
    }

    const image = new Image()
    image.decoding = 'async'
    image.onload = finish
    image.onerror = finish
    image.src = resolvedPath

    if (image.complete) {
      window.setTimeout(finish, 0)
    }
  })

  mediaCache.set(normalizedPath, task)
  return task
}

export function primeMedia(paths: Array<string | undefined>) {
  return Promise.all(
    paths.filter((path): path is string => Boolean(path)).map((path) => primeOne(path)),
  ).then(() => undefined)
}

export function scheduleMediaWarmup(
  paths: Array<string | undefined>,
  options: {
    delay?: number
    timeout?: number
  } = {},
) {
  if (typeof window === 'undefined') {
    return () => undefined
  }

  const { delay = 160, timeout = 1200 } = options
  const idleWindow = window as IdleWindow
  let timer = 0
  let idleHandle: number | null = null
  let cancelled = false

  const run = () => {
    if (cancelled) {
      return
    }

    void primeMedia(paths)
  }

  timer = window.setTimeout(() => {
    if (idleWindow.requestIdleCallback) {
      idleHandle = idleWindow.requestIdleCallback(run, { timeout })
      return
    }

    run()
  }, delay)

  return () => {
    cancelled = true
    window.clearTimeout(timer)

    if (idleHandle !== null && idleWindow.cancelIdleCallback) {
      idleWindow.cancelIdleCallback(idleHandle)
    }
  }
}
