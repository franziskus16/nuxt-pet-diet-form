import { FormStep, Group } from '~/domain/form/entities'
import type { FormStorage, SavedForm } from '~/domain/form/ports'

const GROUP_KEY = 'pet-meal-planner.ab-group'
const FORM_KEY = 'pet-meal-planner.form'

const isGroup = (value: unknown): value is Group =>
  value === Group.A || value === Group.B

const isStep = (value: unknown): value is FormStep =>
  Object.values(FormStep).includes(value as FormStep)

/** Persists the A/B group and form progress in localStorage, ignoring corrupt data. */
export class LocalFormStorage implements FormStorage {
  constructor(private readonly storage: Storage = localStorage) {}

  loadGroup(): Group | null {
    const value = this.read(GROUP_KEY)
    return isGroup(value) ? value : null
  }

  saveGroup(group: Group): void {
    this.write(GROUP_KEY, group)
  }

  loadForm(): SavedForm | null {
    try {
      const raw = this.read(FORM_KEY)
      if (!raw) return null
      const parsed = JSON.parse(raw) as Partial<SavedForm>
      if (!isGroup(parsed.group) || !isStep(parsed.step) || typeof parsed.profile !== 'object') {
        return null
      }
      return parsed as SavedForm
    } catch {
      return null
    }
  }

  saveForm(form: SavedForm): void {
    this.write(FORM_KEY, JSON.stringify(form))
  }

  clearForm(): void {
    try {
      this.storage.removeItem(FORM_KEY)
    } catch {
      /* storage unavailable */
    }
  }

  private read(key: string): string | null {
    try {
      return this.storage.getItem(key)
    } catch {
      return null
    }
  }

  private write(key: string, value: string): void {
    try {
      this.storage.setItem(key, value)
    } catch {
      /* storage full or blocked: the form still works, it just won't survive a reload */
    }
  }
}
