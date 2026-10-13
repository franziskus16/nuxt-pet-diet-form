import type { ActivityLevel, DietGoal, FoodBehaviour } from '~/domain/form/entities'

type Option<T extends string> = { value: T; label: string; description?: string }

export const dietGoalOptions: Option<DietGoal>[] = [
  { value: 'lose-weight', label: 'Lose weight', description: 'A lighter plan with fewer calories.' },
  { value: 'maintain', label: 'Stay in shape', description: 'Keep the current weight.' },
  { value: 'gain-weight', label: 'Gain weight', description: 'More energy for growing or thin dogs.' },
]

export const foodBehaviourOptions: Option<FoodBehaviour>[] = [
  { value: 'picky', label: 'Picky', description: 'Often leaves food in the bowl.' },
  { value: 'curious', label: 'Curious', description: 'Happy to try new things.' },
  { value: 'greedy', label: 'Greedy', description: 'Eats anything, fast.' },
]

export const activityLevelOptions: Option<ActivityLevel>[] = [
  { value: 'low', label: 'Low', description: 'Short walks, lots of naps.' },
  { value: 'medium', label: 'Medium', description: 'A couple of good walks a day.' },
  { value: 'high', label: 'High', description: 'Runs, hikes or dog sports.' },
]

export function labelFor<T extends string>(options: Option<T>[], value: T | null): string {
  return options.find((option) => option.value === value)?.label ?? '—'
}
