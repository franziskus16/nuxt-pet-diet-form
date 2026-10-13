import { FormStep, Group } from './entities'

const ALL_STEPS: readonly FormStep[] = [
  FormStep.Breed,
  FormStep.PetName,
  FormStep.PetAge,
  FormStep.PetWeight,
  FormStep.DietGoal,
  FormStep.FoodBehaviour,
  FormStep.ActivityLevel,
  FormStep.Summary,
]

/** The experiment: group B skips the activity-level question. */
export function getStepList(group: Group): FormStep[] {
  return group === Group.B
    ? ALL_STEPS.filter((step) => step !== FormStep.ActivityLevel)
    : [...ALL_STEPS]
}

export function getNextStep(current: FormStep, group: Group): FormStep | null {
  const steps = getStepList(group)
  const index = steps.indexOf(current)
  return index >= 0 && index < steps.length - 1 ? steps[index + 1]! : null
}

export function getPreviousStep(current: FormStep, group: Group): FormStep | null {
  const steps = getStepList(group)
  const index = steps.indexOf(current)
  return index > 0 ? steps[index - 1]! : null
}

/** 1-based position of a step and the total, for the progress bar. */
export function getProgress(current: FormStep, group: Group): { position: number; total: number } {
  const steps = getStepList(group)
  return { position: Math.max(steps.indexOf(current), 0) + 1, total: steps.length }
}
