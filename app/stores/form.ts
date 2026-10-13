import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { FormStep, Group, emptyProfile, type PetProfile } from '~/domain/form/entities'
import { getNextStep, getPreviousStep, getProgress, getStepList } from '~/domain/form/stepFlow'
import { getDependencies } from '~/infrastructure/dependencies'

/**
 * Application layer: orchestrates the domain rules (step flow) and the ports
 * (storage, analytics). Components only talk to this store.
 */
export const useFormStore = defineStore('form', () => {
  const group = ref<Group>(Group.A)
  const step = ref<FormStep>(FormStep.Breed)
  const profile = ref<PetProfile>(emptyProfile())
  const submitted = ref(false)
  const ready = ref(false)

  const steps = computed(() => getStepList(group.value))
  const progress = computed(() => getProgress(step.value, group.value))
  const isFirstStep = computed(() => getPreviousStep(step.value, group.value) === null)

  function persist() {
    getDependencies().storage.saveForm({
      group: group.value,
      step: step.value,
      profile: profile.value,
    })
  }

  /** Restores a saved form, or assigns an A/B group (once per browser) and starts fresh. */
  function init() {
    const { storage, analytics, random } = getDependencies()
    const saved = storage.loadForm()

    if (saved) {
      group.value = saved.group
      // A saved step that doesn't belong to this group (e.g. data from an older version) restarts the form.
      step.value = getStepList(saved.group).includes(saved.step) ? saved.step : FormStep.Breed
      profile.value = { ...emptyProfile(), ...saved.profile }
    } else {
      const storedGroup = storage.loadGroup()
      if (storedGroup) {
        group.value = storedGroup
      } else {
        group.value = random() < 0.5 ? Group.A : Group.B
        storage.saveGroup(group.value)
        analytics.track({ name: 'ab_group_assigned', group: group.value })
      }
      step.value = FormStep.Breed
      profile.value = emptyProfile()
    }

    submitted.value = false
    ready.value = true
  }

  /** Saves the answers for the current step and moves on. */
  function completeStep(answers: Partial<PetProfile>) {
    profile.value = { ...profile.value, ...answers }
    getDependencies().analytics.track({
      name: 'step_completed',
      step: step.value,
      group: group.value,
    })
    step.value = getNextStep(step.value, group.value) ?? step.value
    persist()
  }

  function goBack() {
    step.value = getPreviousStep(step.value, group.value) ?? step.value
    persist()
  }

  function submit() {
    getDependencies().analytics.track({
      name: 'form_completed',
      group: group.value,
      profile: profile.value,
    })
    submitted.value = true
    getDependencies().storage.clearForm()
  }

  /** Starts over, keeping the same A/B group so the experiment stays consistent. */
  function restart() {
    getDependencies().storage.clearForm()
    step.value = FormStep.Breed
    profile.value = emptyProfile()
    submitted.value = false
  }

  return {
    group,
    step,
    profile,
    submitted,
    ready,
    steps,
    progress,
    isFirstStep,
    init,
    completeStep,
    goBack,
    submit,
    restart,
  }
})
