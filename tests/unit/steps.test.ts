import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import BreedStep from '~/components/form/steps/BreedStep.vue'
import PetAgeStep from '~/components/form/steps/PetAgeStep.vue'
import PetNameStep from '~/components/form/steps/PetNameStep.vue'
import SummaryStep from '~/components/form/steps/SummaryStep.vue'
import { FormStep } from '~/domain/form/entities'
import { useFormStore } from '~/stores/form'
import { installFakes } from './fakes'

function setup(random = 0.1, breeds?: Parameters<typeof installFakes>[0]['breeds']) {
  const pinia = createPinia()
  setActivePinia(pinia)
  const fakes = installFakes({ random, breeds })
  const store = useFormStore()
  store.init()
  return { store, pinia, ...fakes }
}

describe('BreedStep', () => {
  beforeEach(() => vi.clearAllMocks())

  it('lists breeds and saves the chosen one with its photo', async () => {
    const { store, pinia } = setup()
    const wrapper = mount(BreedStep, { global: { plugins: [pinia] } })
    await flushPromises()

    expect(wrapper.findAll('option').map((o) => o.text())).toContain('Australian Shepherd')
    await wrapper.find('select').setValue('shepherd/australian')
    await flushPromises()
    expect(wrapper.find('img').attributes('src')).toBe('https://images.test/shepherd/australian.jpg')

    await wrapper.find('form').trigger('submit')
    expect(store.profile.breed).toBe('Australian Shepherd')
    expect(store.step).toBe(FormStep.PetName)
  })

  it('asks for a breed instead of continuing empty', async () => {
    const { store, pinia } = setup()
    const wrapper = mount(BreedStep, { global: { plugins: [pinia] } })
    await flushPromises()
    await wrapper.find('form').trigger('submit')
    expect(wrapper.text()).toContain('Choose a breed to continue.')
    expect(store.step).toBe(FormStep.Breed)
  })

  it('offers a retry when the breeds cannot be loaded', async () => {
    const list = vi.fn().mockRejectedValueOnce(new Error('offline'))
    const { pinia } = setup(0.1, { list })
    const wrapper = mount(BreedStep, { global: { plugins: [pinia] } })
    await flushPromises()
    expect(wrapper.find('[role="alert"]').text()).toContain("couldn't load")

    list.mockResolvedValueOnce([{ id: 'akita', name: 'Akita' }])
    await wrapper.find('[role="alert"] button').trigger('click')
    await flushPromises()
    expect(wrapper.find('select').exists()).toBe(true)
  })
})

describe('PetNameStep', () => {
  it('uses the breed in the question and validates the name', async () => {
    const { store, pinia } = setup()
    store.completeStep({ breed: 'Akita' })
    const wrapper = mount(PetNameStep, { global: { plugins: [pinia] } })

    expect(wrapper.find('h1').text()).toBe("What's your Akita's name?")
    await wrapper.find('form').trigger('submit')
    expect(wrapper.text()).toContain('Tell us your dog’s name.')

    await wrapper.find('input').setValue('  Luna ')
    await wrapper.find('form').trigger('submit')
    expect(store.profile.petName).toBe('Luna')
    expect(store.step).toBe(FormStep.PetAge)
  })
})

describe('PetAgeStep', () => {
  it('links the label and error to the input for screen readers', async () => {
    const { pinia } = setup()
    const wrapper = mount(PetAgeStep, { global: { plugins: [pinia] } })
    const input = wrapper.find('input')
    expect(wrapper.find(`label[for="${input.attributes('id')}"]`).text()).toBe('Age')

    await input.setValue('2.5')
    await wrapper.find('form').trigger('submit')
    expect(input.attributes('aria-invalid')).toBe('true')
    expect(wrapper.text()).toContain('whole number')
  })
})

describe('SummaryStep', () => {
  it('shows the activity row only for group A', () => {
    const groupA = setup(0.1)
    expect(mount(SummaryStep, { global: { plugins: [groupA.pinia] } }).text()).toContain('Activity')

    const groupB = setup(0.9)
    expect(mount(SummaryStep, { global: { plugins: [groupB.pinia] } }).text()).not.toContain('Activity')
  })

  it('submits and shows the confirmation', async () => {
    const { store, pinia, events } = setup()
    store.profile.petName = 'Luna'
    const wrapper = mount(SummaryStep, { global: { plugins: [pinia] } })
    await wrapper.find('form').trigger('submit')

    expect(wrapper.find('[data-testid="success-message"]').text()).toContain("Luna's plan is on its way.")
    expect(events.at(-1)?.name).toBe('form_completed')
  })
})
