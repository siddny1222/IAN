import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { PerformanceContext } from './performance-context'
import { detectPerformanceProfile, getConnectionInfo } from '../lib/performance'

export function PerformanceProvider({
  children,
}: {
  children: ReactNode
}) {
  const [profile, setProfile] = useState(detectPerformanceProfile)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const connection = getConnectionInfo()
    const updateProfile = () => {
      setProfile(detectPerformanceProfile())
    }

    updateProfile()
    mediaQuery.addEventListener('change', updateProfile)
    connection?.addEventListener?.('change', updateProfile)

    return () => {
      mediaQuery.removeEventListener('change', updateProfile)
      connection?.removeEventListener?.('change', updateProfile)
    }
  }, [])

  useEffect(() => {
    document.documentElement.dataset.performanceTier = profile.tier
    document.documentElement.dataset.motionPreference = profile.prefersReducedMotion
      ? 'reduce'
      : 'full'
  }, [profile])

  return (
    <PerformanceContext.Provider value={profile}>
      {children}
    </PerformanceContext.Provider>
  )
}
