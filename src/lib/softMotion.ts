type MotionStep = {
  keyframes: Keyframe[]
  options: KeyframeAnimationOptions
  selector: string
  staggerMs?: number
}

type MotionCleanup = () => void

function queryAll(selector: string) {
  return Array.from(document.querySelectorAll<HTMLElement>(selector))
}

export function runSoftMotion(steps: MotionStep[]) {
  if (typeof window === 'undefined') {
    return
  }

  const animations: Animation[] = []

  steps.forEach(({ selector, keyframes, options, staggerMs = 0 }) => {
    const nodes = queryAll(selector)
    nodes.forEach((node, index) => {
      if (!node.animate) {
        return
      }

      node.getAnimations().forEach((animation) => animation.cancel())

      const animation = node.animate(keyframes, {
        ...options,
        delay: (options.delay ?? 0) + index * staggerMs,
      })
      animations.push(animation)
    })
  })

  return (() => {
    animations.forEach((animation) => animation.cancel())
  }) satisfies MotionCleanup
}

export function runRoutePulse(selector: string) {
  if (typeof window === 'undefined') {
    return
  }

  const nodes = queryAll(selector)
  const animations: Animation[] = []

  nodes.forEach((node) => {
    if (!node.animate) {
      return
    }

    node.getAnimations().forEach((animation) => animation.cancel())

    const animation = node.animate(
      [
        { opacity: 0.06 },
        { opacity: 0.28 },
        { opacity: 0.1 },
      ],
      { duration: 360, easing: 'cubic-bezier(0.22,1,0.36,1)' },
    )
    animations.push(animation)
  })

  return (() => {
    animations.forEach((animation) => animation.cancel())
  }) satisfies MotionCleanup
}
