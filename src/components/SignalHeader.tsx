import { Link } from 'react-router-dom'
import { useLocale } from '../context/useLocale'
import { usePerformanceProfile } from '../context/usePerformanceProfile'
import { primeMedia } from '../lib/mediaLoader'
import { buildMediaQueue } from '../lib/performance'
import { primeThemeSceneRoute } from '../lib/routeModules'
import {
  interfaceCopy,
  pickLocalized,
  visibleDimensions,
  type Dimension,
  type Language,
} from '../data/scenes'

type SignalHeaderProps = {
  activeDimension?: Dimension
}

const locales: Language[] = ['zh', 'en', 'de']

export default function SignalHeader({ activeDimension }: SignalHeaderProps) {
  const { language, setLanguage } = useLocale()
  const performanceProfile = usePerformanceProfile()
  const brandStamp = pickLocalized(interfaceCopy.brandStamp, language)
  const driftLabel = pickLocalized(interfaceCopy.driftLabel, language)
  const localeLabel = pickLocalized(interfaceCopy.localeLabel, language)

  return (
    <header className="signal-header">
      <div className="signal-header__brand-cluster">
        <Link className="signal-header__brand" to="/">
          <span className="signal-header__brand-mark" data-ghost-text="IAN">IAN</span>
          <span className="signal-header__brand-copy" data-ghost-text={brandStamp}>
            {brandStamp}
          </span>
        </Link>
      </div>

      <div className="signal-header__controls">
        <div className="signal-header__locale" aria-label={localeLabel}>
          {locales.map((entry) => (
            <button
              className={entry === language ? 'is-active' : ''}
              data-ghost-text={entry}
              key={entry}
              onClick={() => setLanguage(entry)}
              type="button"
            >
              {entry}
            </button>
          ))}
        </div>
      </div>

      <nav
        aria-label={driftLabel}
        className="signal-header__drift"
      >
        {visibleDimensions.map((dimension) => {
          const dimensionTitle = pickLocalized(dimension.title, language)

          return (
            <Link
              className={activeDimension?.slug === dimension.slug ? 'is-active' : ''}
              data-ghost-text={dimensionTitle}
              key={dimension.slug}
              onFocus={() => {
                void primeThemeSceneRoute()
                void primeMedia(buildMediaQueue([
                  dimension.media.still,
                  dimension.media.texture,
                  dimension.media.overlay,
                  dimension.media.relic,
                ], performanceProfile, { limit: 4 }))
              }}
              onMouseEnter={() => {
                void primeThemeSceneRoute()
                void primeMedia(buildMediaQueue([
                  dimension.media.still,
                  dimension.media.texture,
                  dimension.media.overlay,
                  dimension.media.relic,
                ], performanceProfile, { limit: 4 }))
              }}
              onTouchStart={() => {
                void primeThemeSceneRoute()
                void primeMedia(buildMediaQueue([
                  dimension.media.still,
                  dimension.media.texture,
                  dimension.media.overlay,
                  dimension.media.relic,
                ], performanceProfile, { limit: 4 }))
              }}
              to={dimension.path}
            >
              {dimensionTitle}
            </Link>
          )
        })}
      </nav>
    </header>
  )
}
