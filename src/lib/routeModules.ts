import { lazy } from 'react'

const loadHomeExperienceModule = () => import('../pages/HomeExperience')
const loadThemeSceneModule = () => import('../pages/ThemeScene')

export const HomeExperienceRoute = lazy(loadHomeExperienceModule)
export const ThemeSceneRoute = lazy(loadThemeSceneModule)

export function primeHomeExperienceRoute() {
  return loadHomeExperienceModule()
}

export function primeThemeSceneRoute() {
  return loadThemeSceneModule()
}
