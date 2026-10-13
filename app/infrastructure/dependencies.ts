import type { AnalyticsTracker, BreedRepository, FormStorage } from '~/domain/form/ports'
import { DataLayerAnalytics } from './dataLayerAnalytics'
import { DogCeoBreedRepository } from './dogCeoBreedRepository'
import { LocalFormStorage } from './localFormStorage'

export interface Dependencies {
  breeds: BreedRepository
  analytics: AnalyticsTracker
  storage: FormStorage
  /** Injected so tests can control the A/B assignment. */
  random: () => number
}

let current: Dependencies | null = null

/** Wires the real adapters on first use (browser only). */
export function getDependencies(): Dependencies {
  current ??= {
    breeds: new DogCeoBreedRepository(),
    analytics: new DataLayerAnalytics(),
    storage: new LocalFormStorage(),
    random: Math.random,
  }
  return current
}

/** Swaps adapters, e.g. for fakes in unit tests. */
export function setDependencies(deps: Dependencies | null): void {
  current = deps
}
