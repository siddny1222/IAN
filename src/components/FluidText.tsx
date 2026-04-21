import type { CSSProperties, ElementType } from 'react'
import { useEffect, useRef, memo } from 'react'
import { gsap } from '../lib/gsapInit'

type FluidTextProps = {
  as?: ElementType
  className?: string
  text: string
  influence?: number
  fog?: boolean
}

type PhysState = {
  x: number
  y: number
  vx: number
  vy: number
  highlight: number
}

// Lerp two RGB channels
function lerpChannel(a: number, b: number, t: number): number {
  return Math.round(a + (b - a) * t)
}

// Default warm-white → electric blue-white on cursor proximity
const colorA = { r: 241, g: 234, b: 224, a: 0.94 }
const colorB = { r: 198, g: 238, b: 255, a: 1.0 }

const FluidText = memo(function FluidText({
  as: Tag = 'span',
  className = '',
  text,
  influence = 112,
  fog = true,
}: FluidTextProps) {
  const containerRef = useRef<HTMLElement>(null)
  const charRefs = useRef<(HTMLSpanElement | null)[]>([])
  const states = useRef<PhysState[]>([])
  const mouseXY = useRef<{ x: number; y: number } | null>(null)
  const chars = Array.from(text)

  // Entry fog-coalescing animation + state init
  useEffect(() => {
    states.current = chars.map(() => ({
      x: 0, y: 0, vx: 0, vy: 0, highlight: 0,
    }))

    const els = charRefs.current.filter((el): el is HTMLSpanElement => el !== null)
    if (!els.length) return

    if (fog) {
      gsap.fromTo(
        els,
        {
          x: () => gsap.utils.random(-72, 72) as number,
          y: () => gsap.utils.random(-56, 56) as number,
          opacity: 0,
          scale: () => gsap.utils.random(0.28, 1.5) as number,
          rotation: () => gsap.utils.random(-52, 52) as number,
          filter: 'blur(16px)',
        },
        {
          x: 0,
          y: 0,
          opacity: 1,
          scale: 1,
          rotation: 0,
          filter: 'blur(0px)',
          duration: 1.7,
          ease: 'power3.out',
          stagger: { from: 'random', amount: 0.75 },
          clearProps: 'filter',
        },
      )
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, fog])

  // Physics ticker – runs every frame
  useEffect(() => {
    const SPRING = 0.074
    const DRAG = 0.81

    const tick = () => {
      const s = states.current
      const mouse = mouseXY.current

      for (let i = 0; i < s.length; i++) {
        const el = charRefs.current[i]
        if (!el) continue

        const st = s[i]

        // Mouse repulsion
        if (mouse) {
          const rect = el.getBoundingClientRect()
          const cx = rect.left + rect.width * 0.5
          const cy = rect.top + rect.height * 0.5
          const dx = cx - mouse.x
          const dy = cy - mouse.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < influence && dist > 0.5) {
            const t = 1 - dist / influence
            const force = t * t * 12
            st.vx += (dx / dist) * force
            st.vy += (dy / dist) * force
            st.highlight = Math.min(1, st.highlight + t * 0.18)
          }
        }

        // Spring back to origin
        st.vx += -st.x * SPRING
        st.vy += -st.y * SPRING
        // Drag
        st.vx *= DRAG
        st.vy *= DRAG
        // Integrate
        st.x += st.vx
        st.y += st.vy
        // Decay highlight
        st.highlight *= 0.9

        // Visual from displacement
        const disp = Math.sqrt(st.x * st.x + st.y * st.y)
        const blurVal = Math.min(disp * 0.115, 9.5)
        const alpha = Math.max(0.38, 1 - disp * 0.0075)

        // Interpolated color
        const h = st.highlight
        const r = lerpChannel(colorA.r, colorB.r, h)
        const g = lerpChannel(colorA.g, colorB.g, h)
        const b = lerpChannel(colorA.b, colorB.b, h)
        const a = colorA.a + (colorB.a - colorA.a) * h

        el.style.transform = `translate(${st.x.toFixed(2)}px,${st.y.toFixed(2)}px)`
        el.style.opacity = (alpha * a).toFixed(3)
        el.style.color = h > 0.04
          ? `rgb(${r},${g},${b})`
          : ''
        if (blurVal > 0.4) {
          el.style.filter = `blur(${blurVal.toFixed(2)}px)`
        } else if (el.style.filter) {
          el.style.filter = ''
        }
      }
    }

    gsap.ticker.add(tick)
    return () => { gsap.ticker.remove(tick) }
  }, [influence])

  return (
    <Tag
      ref={containerRef as never}
      className={`fluid-text ${className}`}
      onMouseMove={(e: React.MouseEvent) => {
        mouseXY.current = { x: e.clientX, y: e.clientY }
      }}
      onMouseLeave={() => {
        mouseXY.current = null
      }}
    >
      {chars.map((char, i) => (
        <span
          key={`${char}-${i}`}
          ref={(el) => { charRefs.current[i] = el }}
          className="fluid-text__char"
          style={{ '--char-index': i } as CSSProperties}
        >
          {char === ' ' ? ' ' : char}
        </span>
      ))}
    </Tag>
  )
})

export default FluidText
