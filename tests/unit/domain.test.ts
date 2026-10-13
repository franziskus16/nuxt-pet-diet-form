import { describe, expect, it } from 'vitest'
import { FormStep, Group } from '~/domain/form/entities'
import { getNextStep, getPreviousStep, getProgress, getStepList } from '~/domain/form/stepFlow'
import { validatePetAge, validatePetName, validatePetWeight } from '~/domain/form/validation'

describe('step flow', () => {
  it('shows the activity step to group A', () => {
    expect(getStepList(Group.A)).toContain(FormStep.ActivityLevel)
    expect(getStepList(Group.A)).toHaveLength(8)
  })

  it('skips the activity step for group B', () => {
    expect(getStepList(Group.B)).not.toContain(FormStep.ActivityLevel)
    expect(getNextStep(FormStep.FoodBehaviour, Group.B)).toBe(FormStep.Summary)
    expect(getPreviousStep(FormStep.Summary, Group.B)).toBe(FormStep.FoodBehaviour)
  })

  it('goes through the activity step for group A', () => {
    expect(getNextStep(FormStep.FoodBehaviour, Group.A)).toBe(FormStep.ActivityLevel)
    expect(getNextStep(FormStep.ActivityLevel, Group.A)).toBe(FormStep.Summary)
  })

  it('has no step before the first or after the last', () => {
    expect(getPreviousStep(FormStep.Breed, Group.A)).toBeNull()
    expect(getNextStep(FormStep.Summary, Group.A)).toBeNull()
  })

  it('reports progress relative to the group', () => {
    expect(getProgress(FormStep.Summary, Group.A)).toEqual({ position: 8, total: 8 })
    expect(getProgress(FormStep.Summary, Group.B)).toEqual({ position: 7, total: 7 })
  })
})

describe('validation', () => {
  it('requires a reasonable name', () => {
    expect(validatePetName('  ')).not.toBeNull()
    expect(validatePetName('x'.repeat(31))).not.toBeNull()
    expect(validatePetName('Luna')).toBeNull()
  })

  it('accepts whole-number ages from 0 to 30', () => {
    expect(validatePetAge(null)).not.toBeNull()
    expect(validatePetAge(2.5)).not.toBeNull()
    expect(validatePetAge(31)).not.toBeNull()
    expect(validatePetAge(0)).toBeNull()
    expect(validatePetAge(12)).toBeNull()
  })

  it('accepts weights from 0.5 to 100 kg', () => {
    expect(validatePetWeight(null)).not.toBeNull()
    expect(validatePetWeight(0.2)).not.toBeNull()
    expect(validatePetWeight(120)).not.toBeNull()
    expect(validatePetWeight(12.5)).toBeNull()
  })
})
