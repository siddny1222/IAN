import { createContext } from 'react'
import { detectPerformanceProfile, type PerformanceProfile } from '../lib/performance'

export const PerformanceContext = createContext<PerformanceProfile>(detectPerformanceProfile())
