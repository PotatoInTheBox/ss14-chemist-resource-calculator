/**
 * File: loadPresets.ts
 *
 * Responsibility:
 * - Load the JSON data into their typed models
 * - Specifically, we load into PRESET
 */

import rawIngredientDefaults from '@data/ingredientDefaults.json'
import rawGoalDefaults from '@data/goalDefaults.json'
import type { Preset } from '@model/preset'
import type { Chemical } from '@model/chemical'

const rawTypedIngredientDefaults = rawIngredientDefaults as Record<string, Chemical[]>
const rawTypedGoalDefaults = rawGoalDefaults as Record<string, Chemical[]>

// Read JSON directly to typed objects on initialize
export const ingredientDefaults: Preset[] =
  Object.entries(rawTypedIngredientDefaults).map(([name, entries]) => ({
    name,
    entries,
  }))

export const goalDefaults: Preset[] =
  Object.entries(rawTypedGoalDefaults).map(([name, entries]) => ({
    name,
    entries,
  }))