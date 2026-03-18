import { createPortal } from 'react-dom'
import { useEffect, useRef, useState } from 'react'
import { usePerformanceProfile } from '../context/usePerformanceProfile'

type CursorMode = 'default' | 'pointer' | 'text' | 'busy'

const TEXT_INPUT_SELECTOR = [
  'textarea',
  '[contenteditable="true"]',
  'input:not([type])',
  'input[type="text"]',
  'input[type="search"]',
  'input[type="email"]',
  'input[type="password"]',
  'input[type="tel"]',
  'input[type="url"]',
  'input[type="number"]',
].join(', ')

const BUSY_SELECTOR = [
  '[aria-busy="true"]',
  'button:disabled',
  'input:disabled',
  'textarea:disabled',
  'select:disabled',
].join(', ')

const INTERACTIVE_SELECTOR = [
  'a',
  'button',
  '[role="button"]',
  'summary',
  'select',
  'option',
  'label[for]',
].join(', ')

const TEXTUAL_SELECTOR = [
  'p',
  'span',
  'small',
  'strong',
  'em',
  'i',
  'b',
  'li',
  'blockquote',
  'figcaption',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
].join(', ')

function resolveCursorMode(target: Element | null) {
  if (!target) {
    return 'default' as CursorMode
  }

  if (target.closest(BUSY_SELECTOR)) {
    return 'busy' as CursorMode
  }

  if (target.closest(TEXT_INPUT_SELECTOR)) {
    return 'text' as CursorMode
  }

  if (target.closest(INTERACTIVE_SELECTOR)) {
    return 'pointer' as CursorMode
  }

  const textSurface = target.closest(TEXTUAL_SELECTOR)
  if (!textSurface) {
    return 'default' as CursorMode
  }

  const style = window.getComputedStyle(textSurface)
  return style.userSelect !== 'none' ? ('text' as CursorMode) : ('default' as CursorMode)
}

export default function XpCursor() {
  const performanceProfile = usePerformanceProfile()
  const [enabled, setEnabled] = useState(false)
  const cursorRef = useRef<HTMLDivElement>(null)
  const modeRef = useRef<CursorMode>('default')
  const pressedRef = useRef(false)
  const visibleRef = useRef(false)
  const frameRef = useRef<number | null>(null)
  const positionRef = useRef({ x: 0, y: 0 })
  const targetRef = useRef<Element | null>(null)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(pointer: fine)')
    const updateEnabled = () => {
      const nextEnabled = mediaQuery.matches && !performanceProfile.disableCustomCursor
      setEnabled(nextEnabled)
      document.documentElement.classList.toggle('cursor-active', nextEnabled)
    }

    updateEnabled()
    mediaQuery.addEventListener('change', updateEnabled)

    return () => {
      document.documentElement.classList.remove('cursor-active')
      mediaQuery.removeEventListener('change', updateEnabled)
    }
  }, [performanceProfile.disableCustomCursor])

  useEffect(() => {
    const cursor = cursorRef.current

    if (!enabled || !cursor) {
      return
    }

    const commit = () => {
      frameRef.current = null
      cursor.style.setProperty('--cursor-x', `${positionRef.current.x}px`)
      cursor.style.setProperty('--cursor-y', `${positionRef.current.y}px`)
    }

    const updateTarget = (event: PointerEvent) => {
      positionRef.current = { x: event.clientX, y: event.clientY }

      if (!frameRef.current) {
        frameRef.current = window.requestAnimationFrame(commit)
      }

      const element = event.target instanceof Element ? event.target : null
      if (targetRef.current !== element) {
        targetRef.current = element
        const mode = resolveCursorMode(element)
        if (modeRef.current !== mode) {
          modeRef.current = mode
          cursor.dataset.mode = mode
          cursor.classList.toggle('is-interactive', mode === 'pointer')
        }
      }

      if (!visibleRef.current) {
        visibleRef.current = true
        cursor.classList.add('is-visible')
      }
    }

    const hide = () => {
      visibleRef.current = false
      pressedRef.current = false
      cursor.classList.remove('is-visible', 'is-pressed')
      cursor.dataset.mode = 'default'
      modeRef.current = 'default'
      targetRef.current = null
    }

    const press = () => {
      if (!visibleRef.current) {
        return
      }

      pressedRef.current = true
      cursor.classList.add('is-pressed')
    }

    const release = () => {
      pressedRef.current = false
      cursor.classList.remove('is-pressed')
    }

    window.addEventListener('pointermove', updateTarget, { passive: true })
    window.addEventListener('pointerdown', press, { passive: true })
    window.addEventListener('pointerup', release, { passive: true })
    window.addEventListener('pointercancel', release, { passive: true })
    window.addEventListener('blur', hide)
    document.addEventListener('visibilitychange', hide)
    document.addEventListener('mouseleave', hide)

    return () => {
      if (frameRef.current) {
        window.cancelAnimationFrame(frameRef.current)
        frameRef.current = null
      }
      window.removeEventListener('pointermove', updateTarget)
      window.removeEventListener('pointerdown', press)
      window.removeEventListener('pointerup', release)
      window.removeEventListener('pointercancel', release)
      window.removeEventListener('blur', hide)
      document.removeEventListener('visibilitychange', hide)
      document.removeEventListener('mouseleave', hide)
    }
  }, [enabled])

  if (!enabled || typeof document === 'undefined') {
    return null
  }

  return createPortal(
    <div aria-hidden="true" className="xp-cursor" data-mode="default" ref={cursorRef}>
      <span className="xp-cursor__sprite"></span>
    </div>,
    document.body,
  )
}
