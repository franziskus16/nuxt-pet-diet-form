import type { Breed } from '~/domain/form/entities'
import type { BreedRepository } from '~/domain/form/ports'

const API = 'https://dog.ceo/api'

type BreedListResponse = { message: Record<string, string[]>; status: string }
type ImageResponse = { message: string; status: string }

const titleCase = (words: string[]) =>
  words.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')

/** Turns { shepherd: ['australian'], akita: [] } into a sorted list of breeds. */
export function toBreeds(message: BreedListResponse['message']): Breed[] {
  return Object.entries(message)
    .flatMap(([breed, subBreeds]) =>
      subBreeds.length
        ? subBreeds.map((sub) => ({ id: `${breed}/${sub}`, name: titleCase([sub, breed]) }))
        : [{ id: breed, name: titleCase([breed]) }],
    )
    .sort((a, b) => a.name.localeCompare(b.name))
}

/** Adapter for the public Dog CEO API (https://dog.ceo/dog-api/). No API key needed. */
export class DogCeoBreedRepository implements BreedRepository {
  constructor(private readonly fetchFn: typeof fetch = (...args) => fetch(...args)) {}

  async list(): Promise<Breed[]> {
    const res = await this.fetchFn(`${API}/breeds/list/all`)
    if (!res.ok) throw new Error(`Breeds request failed with ${res.status}`)
    const body = (await res.json()) as BreedListResponse
    return toBreeds(body.message)
  }

  async randomImage(breedId: string): Promise<string | null> {
    try {
      const res = await this.fetchFn(`${API}/breed/${breedId}/images/random`)
      if (!res.ok) return null
      const body = (await res.json()) as ImageResponse
      return body.status === 'success' ? body.message : null
    } catch {
      return null
    }
  }
}
