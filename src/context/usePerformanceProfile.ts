import { useContext } from 'react'
import { PerformanceContext } from './performance-context'

export function usePerformanceProfile() {
  return useContext(PerformanceContext)
}
