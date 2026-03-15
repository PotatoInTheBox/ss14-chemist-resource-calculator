/**
 * File: presets.ts
 *
 * Responsibility:
 * - The CRUD of our presets.
 * - Create/Save new presets and store them appropriately
 * - Read/Load defaults and cookie data into a single reference
 * - Update presets (really the same as saving)
 * - Delete presets thus updating cookie data appropriately (robustly)
 */

import { goalDefaults, ingredientDefaults } from '@data/loadPresets'
import type { Preset } from '@model/preset'

// --- Keys in localStorage ---
// If our local storage has these keys then we fully take control and change
// them as needed.
const INGREDIENTS_KEY = "ingredientPresets"
const GOALS_KEY = "goalPresets"

/** Return the localStorage key for a preset type */
function getKey(type: "ingredients" | "goals") {
  return type === "ingredients" ? INGREDIENTS_KEY : GOALS_KEY
}

/**
 * Check if a preset with the given name exists.
 * Usually used for checking if a preset with the same name already exists (which
 * we can then use to notify the user before changes are attempted).
 */
export function presetExists(type: "ingredients" | "goals", name: string) {
  const presets = loadPresets(type)
  return presetExistsInPreset(name, presets)
}

/**
 * Create a new preset if the name is unique. You probably want to call 
 * loadPresets() to read the new contents.
 * Used when you want to create a new preset with a given preset.
 */
export function createPreset(
  type: "ingredients" | "goals",
  preset: Preset
): boolean {
  const presets = loadPresets(type)
  if (presetExistsInPreset(preset.name, presets)) return false
  storePresetToLocalStorage(type, preset)
  return true
}

/**
 * Load all presets for a type (stored + defaults).
 * Used when you want to get ALL presets available to choose from.
 */
export function loadPresets(type: 'ingredients' | 'goals'): Preset[] {
  const stored: Preset[] = loadFromLocalStorage(type)
  if (type === 'ingredients') stored.push(...ingredientDefaults)
  if (type === 'goals')       stored.push(...goalDefaults)
  return stored
}

/**
 * Delete a preset by name, returns deleted preset or null.
 * Used when you want to delete a given preset.
 */
export function deletePreset(type: 'ingredients' | 'goals', name: string): Preset | null {
  const storedPresets = loadFromLocalStorage(type)
  const index = presetIndex(name, storedPresets)
  if (index < 0)
    return null
  const [deletedPreset] = storedPresets.splice(index, 1)
  savePresets(type, storedPresets)
  return deletedPreset ?? null  // null if we somehow don't retrieve the deleted preset
}

/** Return the index of a preset in an array, or -1 if not found */
function presetIndex(name: string, presets: Preset[]): number {
  return presets.findIndex((p) => p.name === name)
}

/** Check if a preset exists in an array */
function presetExistsInPreset(name: string, presets: Preset[]): boolean {
  return presets.some((p) => p.name === name)
}

/**
 * Save a given preset to local storage
 * 
 * @param preset Should ONLY include a single preset to SAVE, do NOT include DEFAULTS
 */
function storePresetToLocalStorage(type: 'ingredients' | 'goals', preset: Preset) {
  const storedPresets = loadFromLocalStorage(type)
  storedPresets.push(preset)
  savePresets(type, storedPresets)
}

/**
 * Load and parse Presets from local storage
 */
function loadFromLocalStorage(type: 'ingredients' | 'goals'): Preset[] {
  const raw = localStorage.getItem(getKey(type))
  let stored: Preset[] = []

  if (raw) {
    try {
      stored = JSON.parse(raw) as Preset[]
    } catch {
      console.warn('Failed to parse presets for', type)
    }
  }

  return stored
}

/**
 * Save all presets to localStorage
 * 
 * @param presets Should ONLY include presets to SAVE, do NOT include DEFAULTS
 */
function savePresets(type: "ingredients" | "goals", presets: Preset[]) {
  localStorage.setItem(getKey(type), JSON.stringify(presets))
}

