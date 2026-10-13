import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { FormStep, Group } from '~/domain/form/entities'
import { useFormStore } from '~/stores/form'
import { installFakes } from './fakes'

function answerUntilSummary(store: ReturnType<typeof useFormStore>) {
  store.completeStep({ breed: 'Akita' })
  store.completeStep({ petName: 'Luna' })
  store.completeStep({ petAge: 3 })
  store.completeStep({ petWeight: 20 })
  store.completeStep({ dietGoal: 'maintain' })
  store.completeStep({ foodBehaviour: 'greedy' })
  if (store.step === FormStep.ActivityLevel) store.completeStep({ activityLevel: 'high' })
}

describe('form store', () => {
  beforeEach(() => setActivePinia(createPinia()))

  it('assigns a group once and reports it', () => {
    const { events, deps } = installFakes({ random: 0.9 })
    const store = useFormStore()
    store.init()

    expect(store.group).toBe(Group.B)
    expect(deps.storage.loadGroup()).toBe(Group.B)
    expect(events).toContainEqual({ name: 'ab_group_assigned', group: Group.B })
  })

  it('reuses a stored group without re-assigning', () => {
    const { events, deps } = installFakes({ random: 0.1 })
    deps.storage.saveGroup(Group.B)
    const store = useFormStore()
    store.init()

    expect(store.group).toBe(Group.B)
    expect(events.filter((e) => e.name === 'ab_group_assigned')).toHaveLength(0)
  })

  it('takes group A through 8 steps, including activity', () => {
    installFakes({ random: 0.1 })
    const store = useFormStore()
    store.init()
    const visited: FormStep[] = [store.step]
    while (store.step !== FormStep.Summary) {
      store.completeStep({})
      visited.push(store.step)
    }
    expect(visited).toContain(FormStep.ActivityLevel)
    expect(visited).toHaveLength(8)
  })

  it('takes group B straight from eating style to the summary', () => {
    installFakes({ random: 0.9 })
    const store = useFormStore()
    store.init()
    answerUntilSummary(store)

    expect(store.step).toBe(FormStep.Summary)
    expect(store.profile.activityLevel).toBeNull()
    expect(store.progress).toEqual({ position: 7, total: 7 })
  })

  it('saves progress and restores it on the next visit', () => {
    installFakes()
    const first = useFormStore()
    first.init()
    first.completeStep({ breed: 'Akita' })
    first.completeStep({ petName: 'Luna' })

    // A new page load: fresh store, same storage.
    setActivePinia(createPinia())
    const second = useFormStore()
    second.init()

    expect(second.step).toBe(FormStep.PetAge)
    expect(second.profile).toMatchObject({ breed: 'Akita', petName: 'Luna' })
  })

  it('restarts when the saved step does not exist for the group', () => {
    const { deps } = installFakes()
    deps.storage.saveForm({
      group: Group.B,
      step: FormStep.ActivityLevel,
      profile: { petName: 'Luna' } as never,
    })
    const store = useFormStore()
    store.init()
    expect(store.step).toBe(FormStep.Breed)
  })

  it('goes back one step and never before the first', () => {
    installFakes()
    const store = useFormStore()
    store.init()
    store.goBack()
    expect(store.step).toBe(FormStep.Breed)
    store.completeStep({ breed: 'Akita' })
    store.goBack()
    expect(store.step).toBe(FormStep.Breed)
    expect(store.profile.breed).toBe('Akita')
  })

  it('tracks completion, clears the saved form and keeps the group on restart', () => {
    const { events, deps } = installFakes({ random: 0.9 })
    const store = useFormStore()
    store.init()
    answerUntilSummary(store)
    store.submit()

    expect(store.submitted).toBe(true)
    expect(events.at(-1)).toMatchObject({ name: 'form_completed', group: Group.B })
    expect(deps.storage.loadForm()).toBeNull()

    store.restart()
    expect(store.step).toBe(FormStep.Breed)
    expect(store.profile.petName).toBe('')
    expect(store.group).toBe(Group.B)
  })
})
