import { describe, expect, it, vi } from 'vitest'
import { FormStep, Group, emptyProfile } from '~/domain/form/entities'
import { DataLayerAnalytics } from '~/infrastructure/dataLayerAnalytics'
import { DogCeoBreedRepository, toBreeds } from '~/infrastructure/dogCeoBreedRepository'
import { LocalFormStorage } from '~/infrastructure/localFormStorage'
import { MemoryStorage } from './fakes'

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })

describe('DogCeoBreedRepository', () => {
  it('flattens sub-breeds into readable, sorted names', () => {
    expect(toBreeds({ shepherd: ['australian', 'german'], akita: [] })).toEqual([
      { id: 'akita', name: 'Akita' },
      { id: 'shepherd/australian', name: 'Australian Shepherd' },
      { id: 'shepherd/german', name: 'German Shepherd' },
    ])
  })

  it('throws when the list request fails, so the UI can offer a retry', async () => {
    const repo = new DogCeoBreedRepository(vi.fn(async () => json({}, 500)))
    await expect(repo.list()).rejects.toThrow()
  })

  it('returns null instead of failing when there is no image', async () => {
    const repo = new DogCeoBreedRepository(vi.fn(async () => json({ status: 'error' }, 404)))
    expect(await repo.randomImage('unknown')).toBeNull()
  })

  it('requests the image for a sub-breed path', async () => {
    const fetchFn = vi.fn(async () => json({ status: 'success', message: 'https://img/1.jpg' }))
    const repo = new DogCeoBreedRepository(fetchFn)
    expect(await repo.randomImage('shepherd/australian')).toBe('https://img/1.jpg')
    expect(fetchFn).toHaveBeenCalledWith('https://dog.ceo/api/breed/shepherd/australian/images/random')
  })
})

describe('LocalFormStorage', () => {
  it('round-trips the group and the form', () => {
    const storage = new LocalFormStorage(new MemoryStorage())
    storage.saveGroup(Group.A)
    storage.saveForm({ group: Group.A, step: FormStep.PetAge, profile: emptyProfile() })
    expect(storage.loadGroup()).toBe(Group.A)
    expect(storage.loadForm()?.step).toBe(FormStep.PetAge)
  })

  it('ignores corrupt or tampered data', () => {
    const memory = new MemoryStorage()
    const storage = new LocalFormStorage(memory)
    memory.setItem('pet-meal-planner.ab-group', 'C')
    memory.setItem('pet-meal-planner.form', '{not json')
    expect(storage.loadGroup()).toBeNull()
    expect(storage.loadForm()).toBeNull()
  })
})

describe('DataLayerAnalytics', () => {
  it('pushes events in the shape Google Tag Manager expects', () => {
    window.dataLayer = []
    new DataLayerAnalytics().track({ name: 'ab_group_assigned', group: Group.B })
    expect(window.dataLayer).toEqual([{ event: 'ab_group_assigned', group: 'B' }])
  })
})
