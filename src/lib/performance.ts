type ConnectionLike = EventTarget & {
  effectiveType?: string
  saveData?: boolean
}

type NavigatorWithHints = Navigator & {
  connection?: ConnectionLike
  deviceMemory?: number
  mozConnection?: ConnectionLike
  webkitConnection?: ConnectionLike
}

export type PerformanceProfile = {
  allowAmbientVideo: boolean
  allowHeavyMotion: boolean
  disableCustomCursor: boolean
  lowCpu: boolean
  lowMemory: boolean
  preferStaticMedia: boolean
  prefersReducedMotion: boolean
  saveData: boolean
  slowNetwork: boolean
  tier: 'full' | 'lite'
  warmupLimit: number
}

const MEDIA_FALLBACKS: Record<string, string> = {
  '/media/111.gif': '/media/ian-glitch-still.png',
  '/media/222.gif': '/media/ian-glitch-still.png',
  '/media/clouds-timelapse.webm': '/media/ian-main-hero-poster.png',
  '/media/ian-glitch-installation.gif': '/media/ian-glitch-still.png',
  '/media/ian-main-hero.mp4': '/media/ian-main-hero-poster.png',
  '/media/ian-noise-veil.gif': '/media/ian-main-hero-poster.png',
}

const HIGH_COST_MEDIA = new Set([
  '/media/111.gif',
  '/media/222.gif',
  '/media/clouds-timelapse.webm',
  '/media/ian-glitch-installation.gif',
  '/media/ian-main-hero.mp4',
  '/media/ian-noise-veil.gif',
])

function getBasePrefix() {
  const base = import.meta.env.BASE_URL ?? '/'
  return base === '/' ? '' : base.replace(/\/$/, '')
}

export function getConnectionInfo() {
  if (typeof window === 'undefined') {
    return null
  }

  const navigatorWithHints = window.navigator as NavigatorWithHints
  return navigatorWithHints.connection
    ?? navigatorWithHints.mozConnection
    ?? navigatorWithHints.webkitConnection
    ?? null
}

export function detectPerformanceProfile(): PerformanceProfile {
  if (typeof window === 'undefined') {
    return {
      allowAmbientVideo: true,
      allowHeavyMotion: true,
      disableCustomCursor: false,
      lowCpu: false,
      lowMemory: false,
      preferStaticMedia: false,
      prefersReducedMotion: false,
      saveData: false,
      slowNetwork: false,
      tier: 'full',
      warmupLimit: 18,
    }
  }

  const navigatorWithHints = window.navigator as NavigatorWithHints
  const connection = getConnectionInfo()
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const saveData = Boolean(connection?.saveData)
  const slowNetwork = Boolean(connection?.effectiveType && /(?:slow-2g|2g|3g)/i.test(connection.effectiveType))
  const lowMemory = typeof navigatorWithHints.deviceMemory === 'number' && navigatorWithHints.deviceMemory <= 4
  const lowCpu = typeof navigatorWithHints.hardwareConcurrency === 'number'
    && navigatorWithHints.hardwareConcurrency <= 4
  const tier = prefersReducedMotion || saveData || slowNetwork || lowMemory || lowCpu
    ? 'lite'
    : 'full'

  return {
    allowAmbientVideo: !prefersReducedMotion && !saveData && !slowNetwork && !(lowMemory && lowCpu),
    allowHeavyMotion: !prefersReducedMotion && !saveData,
    disableCustomCursor: tier === 'lite',
    lowCpu,
    lowMemory,
    preferStaticMedia: tier === 'lite',
    prefersReducedMotion,
    saveData,
    slowNetwork,
    tier,
    warmupLimit: tier === 'lite' ? 6 : 18,
  }
}

export function getMediaFallbackPath(path?: string) {
  if (!path) {
    return undefined
  }

  return MEDIA_FALLBACKS[path]
}

export function isVideoPath(path?: string) {
  return Boolean(path && /\.(mp4|mov|webm)$/i.test(path))
}

export function shouldSkipHighCostMedia(path: string, profile: PerformanceProfile) {
  if (profile.tier !== 'lite') {
    return false
  }

  return HIGH_COST_MEDIA.has(path)
}

export function buildMediaQueue(
  paths: Array<string | undefined>,
  profile: PerformanceProfile,
  options: {
    includeHighCost?: boolean
    limit?: number
  } = {},
) {
  const { includeHighCost = false, limit = profile.warmupLimit } = options
  const queue: string[] = []
  const seen = new Set<string>()

  paths.forEach((path) => {
    if (!path || seen.has(path)) {
      return
    }

    if (!includeHighCost && shouldSkipHighCostMedia(path, profile)) {
      return
    }

    seen.add(path)
    queue.push(path)
  })

  return queue.slice(0, limit)
}

export function withBase(path?: string) {
  if (!path) {
    return ''
  }

  if (/^(?:[a-z]+:)?\/\//i.test(path) || path.startsWith('data:')) {
    return path
  }

  if (!path.startsWith('/')) {
    return path
  }

  return `${getBasePrefix()}${path}`
}

export function shouldUseHashRouting() {
  return import.meta.env.VITE_ROUTER_MODE === 'hash'
}
