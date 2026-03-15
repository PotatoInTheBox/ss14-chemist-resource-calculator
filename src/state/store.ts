/**
 * File: store.ts
 *
 * Responsibility:
 * - Defining the global application state
 * - Owns the state of the data and updates listeners when the data is changed
 */

import type { Chemical } from '@model/chemical'
import type { Ingredient } from '@model/ingredient'
import type { Reaction } from '@model/reaction'
import type { Reagent } from '@model/reagent'
import { create } from 'zustand'


interface StoreState {
  /**
   * Map of all reagents (chemicals), keyed by their id
   */
  reagents: Map<string, Reagent>
  /**
   * Map of all reactions, keyed by product id
   */
  reactionsByProduct: Map<string, Reaction>
  /**
   * Map of user goals: which chemicals they want to create and how many
   */
  goals: Map<string, Chemical>
  /**
   * Map of computed ingredient amounts needed for production
   */
  ingredients: Map<string, Ingredient>
  /**
   * Map of initial ingredient amounts
   */
  initialIngredients: Map<string, Ingredient>
  /**
   * Map of computed intermediate amounts needed for production
   */
  intermediates: Map<string, number>

  /**
   * Initializes core data.
   * Replaces ALL reagents and reactions in the store.
   */
  setData: (
    reagents: Map<string, Reagent>,
    reactions: Map<string, Reaction>
  ) => void

  /**
   * Stores computed ingredient and intermediate results
   * produced by the recipe calculation.
   */
  setResults: (
    ingredients: Map<string, Ingredient>,
    intermediates: Map<string, number>
  ) => void

  /**
   * Updates a single production goal and its target amount.
   */
  updateGoal: (
    id: string,
    amt: number
  ) => void

  /**
   * Adds a single production goal and its target amount.
   */
  addGoal: (
    id: string,
    amt: number
  ) => void

  /**
   * Removes a single production goal by chemical id.
   */
  removeGoal: (
    id: string
  ) => void

  /**
   * Clears all user-defined goals.
   */
  removeAllGoals: () => void

  /**
   * Sets the user-provided starting amount for an ingredient.
   */
  updateIngredient: (
    id: string,
    startAmount: number
  ) => void

  /**
   * Add the user-provided starting amount for an ingredient.
   */
  addIngredient: (
    id: string,
    startAmount: number
  ) => void

  /**
   * Removes a single ingredient override from the store.
   */
  removeIngredient: (
    id: string
  ) => void

  /**
   * Clears all user-defined ingredient starting amounts.
   */
  removeAllIngredients: () => void

}

// Create a global store using Zustand (I wanted to try it out a little)
// Zustand allows us to keep shared state for the app, which multiple components can read and update
export const useStore = create<StoreState>((set) => ({
  // --- Initial State ---
  reagents: new Map(),
  reactionsByProduct: new Map(),
  goals: new Map<string, Chemical>(),
  ingredients: new Map(),
  initialIngredients: new Map(),
  intermediates: new Map(),

  // --- Methods to update the state ---

  setData(reagents: Map<string, Reagent>, reactions: Map<string, Reaction>) {
    // 'set' updates the store
    set({ reagents, reactionsByProduct: reactions })
  },

  removeGoal(id: string) {
    set((s: StoreState) => {
      // Create a new Map to avoid mutating the old one (important for React re-render)
      const g = new Map(s.goals)
      
      if (g.has(id)) {
        g.delete(id)
      }

      // Return the updated goals map to update the store
      return { goals: g }
    })
  },

  updateGoal(id: string, amt: number) {
    set((s: StoreState) => {
      // Create a new Map to trigger React re-render
      const g = new Map(s.goals)

      // Set the new quantity
      g.set(id, {id, amount: amt})

      // Return the updated goals
      return { goals: g }
    })
  },

  addGoal(id: string, amt: number) {
    set((s: StoreState) => {
      // Create a new Map to trigger React re-render
      const g = new Map(s.goals)

      const existing = g.get(id)?.amount || 0;

      // Set the new quantity
      g.set(id, {id, amount: existing + amt})

      // Return the updated goals
      return { goals: g }
    })
  },

  removeAllGoals() {
    set({ goals: new Map() });
  },

  updateIngredient(id: string, startAmount: number) {
    set((s: StoreState) => {
      const i = new Map(s.initialIngredients)
      i.set(id, { id, startAmount, computedAmount: 0 }) // reset amount for recalculation
      return { initialIngredients: i }
    })
  },

  addIngredient(id: string, startAmount: number) {
    set((s: StoreState) => {
      const i = new Map(s.initialIngredients)
      const existing = i.get(id)?.startAmount || 0;
      i.set(id, { id, startAmount: startAmount + existing, computedAmount: 0 }) // reset amount for recalculation
      return { initialIngredients: i }
    })
  },

  removeIngredient(id: string) {
    set((s: StoreState) => {
      const i = new Map(s.initialIngredients)
      if (i.has(id)) i.delete(id)
      return { initialIngredients: i }
    })
  },

  removeAllIngredients() {
    set({ initialIngredients: new Map() });
  },

  setResults(ingredients: Map<string, Ingredient>, intermediates: Map<string, number>) {
    // Replace old Maps with new ones to update components
    set({ ingredients, intermediates })
  }
}))
