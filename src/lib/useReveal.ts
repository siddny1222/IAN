import { useCallback, useEffect, useState } from 'react'

type RevealOptions = {
  threshold?: number
  rootMargin?: string
  once?: boolean
}

export function useReveal<T extends HTMLElement = HTMLElement>({
  threshold = 0.16,
  rootMargin = '0px 0px -8% 0px',
  once = true,
}: RevealOptions = {}) {
  const [node, setNode] = useState<T | null>(null)
  const [revealed, setRevealed] = useState(false)
  const ref = useCallback((element: T | null) => {
    setNode(element)
  }, [])

  useEffect(() => {
    if (!node) return

    if (typeof IntersectionObserver === 'undefined') {
      const timer = window.setTimeout(() => {
        setRevealed(true)
      }, 0)

      return () => window.clearTimeout(timer)
    }

    const prefersReduced =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReduced) {
      const timer = window.setTimeout(() => {
        setRevealed(true)
      }, 0)

      return () => window.clearTimeout(timer)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setRevealed(true)
            if (once) observer.disconnect()
          } else if (!once) {
            setRevealed(false)
          }
        }
      },
      { threshold, rootMargin },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [node, once, rootMargin, threshold])

  return { ref, revealed }
}
