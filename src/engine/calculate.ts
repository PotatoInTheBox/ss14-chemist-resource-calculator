/**
 * File: calculate.ts
 *
 * Responsibility:
 * - Calculate all the intermediareies and base ingredients needed for a given chemical output
 * - Recursively expand each chemical as much as possible to get the base materials needed
 */

import type { Ingredient } from "@model/ingredient"
import type { Reaction } from "@model/reaction"
import { addIngredientConsumer, addIngredientGoalConsumer } from "@engine/calculateHelpers"
import type { Chemical } from "@model/chemical"

export interface CalcResult {
  ingredients: Map<string, Ingredient>
  intermediates: Map<string, number>
}

export function calculate(
  targetId: string,
  targetAmount: number,
  reactionsByProduct: Map<string, Reaction>
): CalcResult {
  const ingredients = new Map<string, Ingredient>()
  const intermediates = new Map<string, number>()

  function expand(id: string, amount: number, isRoot = true, parentChem?: Chemical) {
    const reaction = reactionsByProduct.get(id)
    if (!reaction) {
      const existingIngredient = ingredients.get(id)
      if (existingIngredient) {
        existingIngredient.computedAmount -= amount
        if (parentChem) {
          addIngredientGoalConsumer(existingIngredient, {id: targetId, amount: amount})
          addIngredientConsumer(existingIngredient, {id: parentChem.id, amount: amount})
        }
          
        ingredients.set(id, existingIngredient)
      } else {
        const ingredient: Ingredient = { id, startAmount: 0, computedAmount: -amount }
        if (parentChem) {
          addIngredientGoalConsumer(ingredient, {id: targetId, amount: amount})
          addIngredientConsumer(ingredient, {id: parentChem.id, amount: amount})
        }
          
        ingredients.set(id, ingredient)
      }
      return
    }

    const produced = reaction.products[id]
    const scale = amount / produced

    // Only count intermediates if not the root target
    if (!isRoot) {
      intermediates.set(id, (intermediates.get(id) ?? 0) + amount)
    }

    // Handle byproducts
    for (const [productId, productAmount] of Object.entries(reaction.products)) {
      if (productId === id) continue

      const byproductAmount = productAmount * scale
      const existingIngredient = ingredients.get(productId)
      if (existingIngredient) {
        existingIngredient.computedAmount += byproductAmount
        addIngredientGoalConsumer(existingIngredient, {id: targetId, amount: -byproductAmount})
        addIngredientConsumer(existingIngredient, {id, amount: -byproductAmount})
        ingredients.set(productId, existingIngredient)
      } else {
        const ingredient: Ingredient = { id: productId, startAmount: 0, computedAmount: byproductAmount }
        addIngredientGoalConsumer(ingredient, {id: targetId, amount: -byproductAmount})
        addIngredientConsumer(ingredient, {id, amount: -byproductAmount})
        ingredients.set(productId, ingredient)
      }
    }

    // Expand reactants
    for (const [reactantId, reactAmount] of Object.entries(reaction.reactants)) {
      expand(reactantId, reactAmount * scale, false, {id, amount})
    }
  }

  expand(targetId, targetAmount)
  return { ingredients, intermediates }
}
