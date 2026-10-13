import type { Breed, FormStep, Group, PetProfile } from './entities'

/**
 * Ports: what the application needs from the outside world. The domain and
 * the store only depend on these interfaces; the adapters in /infrastructure
 * implement them, so each one can be swapped or faked in tests.
 */

export interface BreedRepository {
  list(): Promise<Breed[]>
  randomImage(breedId: string): Promise<string | null>
}

export type AnalyticsEvent =
  | { name: 'ab_group_assigned'; group: Group }
  | { name: 'step_completed'; step: FormStep; group: Group }
  | { name: 'form_completed'; group: Group; profile: PetProfile }

export interface AnalyticsTracker {
  track(event: AnalyticsEvent): void
}

export interface SavedForm {
  group: Group
  step: FormStep
  profile: PetProfile
}

export interface FormStorage {
  loadGroup(): Group | null
  saveGroup(group: Group): void
  loadForm(): SavedForm | null
  saveForm(form: SavedForm): void
  clearForm(): void
}
