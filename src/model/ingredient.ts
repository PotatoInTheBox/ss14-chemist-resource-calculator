/**
 * File: ingredient.ts
 *
 * Responsibility:
 * - Represent an ingredient
 * - (Similar to chemical but may have additional entries to assist with ingredient responsibilities)
 */

import type { Chemical } from "@model/chemical"

export interface Ingredient {
  id: string
  startAmount: number
  computedAmount: number
  computedConsumers?: Record<string, Chemical>
  computedGoalConsumers?: Record<string, Chemical>
}
