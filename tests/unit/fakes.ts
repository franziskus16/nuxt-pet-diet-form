import { vi } from 'vitest'
import type { Breed } from '~/domain/form/entities'
import type { AnalyticsEvent, BreedRepository } from '~/domain/form/ports'
import { setDependencies, type Dependencies } from '~/infrastructure/dependencies'
import { LocalFormStorage } from '~/infrastructure/localFormStorage'

export const BREEDS: Breed[] = [
  { id: 'akita', name: 'Akita' },
  { id: 'shepherd/australian', name: 'Australian Shepherd' },
  { id: 'labrador', name: 'Labrador' },
]

/** In-memory Storage so tests never touch the real localStorage. */
export class MemoryStorage implements Storage {
  private data = new Map<string, string>()
  get length() {
    return this.data.size
  }
  clear() {
    this.data.clear()
  }
  getItem(key: string) {
    return this.data.get(key) ?? null
  }
  key(index: number) {
    return [...this.data.keys()][index] ?? null
  }
  removeItem(key: string) {
    this.data.delete(key)
  }
  setItem(key: string, value: string) {
    this.data.set(key, value)
  }
}

export function installFakes(options: { random?: number; breeds?: Partial<BreedRepository> } = {}) {
  const events: AnalyticsEvent[] = []
  const memory = new MemoryStorage()
  const breeds: BreedRepository = {
    list: vi.fn(async () => BREEDS),
    randomImage: vi.fn(async (id: string) => `https://images.test/${id}.jpg`),
    ...options.breeds,
  }
  const deps: Dependencies = {
    breeds,
    analytics: { track: (event) => events.push(event) },
    storage: new LocalFormStorage(memory),
    random: () => options.random ?? 0.1,
  }
  setDependencies(deps)
  return { deps, events, memory, breeds }
}
