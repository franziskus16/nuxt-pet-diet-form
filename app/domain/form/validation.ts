/** Validation rules for each answer. Each returns an error message, or null if valid. */

export function validatePetName(value: string): string | null {
  const name = value.trim()
  if (!name) return 'Tell us your dog’s name.'
  if (name.length > 30) return 'Keep the name under 30 characters.'
  return null
}

export function validatePetAge(value: number | null): string | null {
  if (value === null || Number.isNaN(value)) return 'Enter an age in years.'
  if (!Number.isInteger(value) || value < 0 || value > 30) return 'Enter a whole number from 0 to 30.'
  return null
}

export function validatePetWeight(value: number | null): string | null {
  if (value === null || Number.isNaN(value)) return 'Enter a weight in kilograms.'
  if (value < 0.5 || value > 100) return 'Enter a weight between 0.5 and 100 kg.'
  return null
}
