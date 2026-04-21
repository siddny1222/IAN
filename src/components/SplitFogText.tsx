import type { CSSProperties, ElementType, MouseEvent } from 'react'

type SplitFogTextProps = {
  as?: ElementType
  className?: string
  text: string
}

export default function SplitFogText({
  as: Component = 'span',
  className,
  text,
}: SplitFogTextProps) {
  const chars = Array.from(text)

  return (
    <Component
      className={`split-fog-text ${className ?? ''}`}
      data-ghost-text={text}
      onMouseMove={(event: MouseEvent<HTMLElement>) => {
        const rect = event.currentTarget.getBoundingClientRect()
        const x = ((event.clientX - rect.left) / Math.max(rect.width, 1)) * 100
        const y = ((event.clientY - rect.top) / Math.max(rect.height, 1)) * 100
        event.currentTarget.style.setProperty('--fog-x', `${x}%`)
        event.currentTarget.style.setProperty('--fog-y', `${y}%`)
      }}
    >
      {chars.map((char, index) => (
        <span
          className="split-fog-text__char"
          key={`${char}-${index}`}
          style={
            {
              '--char-index': index,
            } as CSSProperties
          }
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </Component>
  )
}
