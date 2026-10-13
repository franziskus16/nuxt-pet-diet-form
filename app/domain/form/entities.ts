/** Steps of the questionnaire, in the order shown to group A. */
export enum FormStep {
  Breed = 'breed',
  PetName = 'petName',
  PetAge = 'petAge',
  PetWeight = 'petWeight',
  DietGoal = 'dietGoal',
  FoodBehaviour = 'foodBehaviour',
  ActivityLevel = 'activityLevel',
  Summary = 'summary',
}

/** A/B test groups. Group B never sees the activity-level step. */
export enum Group {
  A = 'A',
  B = 'B',
}

export type DietGoal = 'lose-weight' | 'gain-weight' | 'maintain'
export type FoodBehaviour = 'picky' | 'curious' | 'greedy'
export type ActivityLevel = 'low' | 'medium' | 'high'

export interface PetProfile {
  breed: string
  breedImage: string | null
  petName: string
  /** Years. */
  petAge: number | null
  /** Kilograms. */
  petWeight: number | null
  dietGoal: DietGoal | null
  foodBehaviour: FoodBehaviour | null
  activityLevel: ActivityLevel | null
}

export interface Breed {
  /** Value sent to the breeds API, e.g. "shepherd/australian". */
  id: string
  /** Human label, e.g. "Australian Shepherd". */
  name: string
}

export const emptyProfile = (): PetProfile => ({
  breed: '',
  breedImage: null,
  petName: '',
  petAge: null,
  petWeight: null,
  dietGoal: null,
  foodBehaviour: null,
  activityLevel: null,
})
