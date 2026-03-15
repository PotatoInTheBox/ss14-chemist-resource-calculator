/**
 * File: conversions.ts
 *
 * Responsibility:
 * - Convert between different chemicals
 */

import type { Chemical } from "@model/chemical";
import type { Ingredient } from "@model/ingredient";

/**
 * Convert an Ingredient to a Chemical type
 */
export function ingredientToChemical(ing: Ingredient): Chemical {
  return { id: ing.id, amount: ing.startAmount };
}

/**
 * Convert a Chemical to an Ingredient type
 */
export function chemicalToIngredient(chem: Chemical, startAmount = 0): Ingredient {
  return { id: chem.id, computedAmount: chem.amount, startAmount };
}

/**
 * Convert Ingredients to Chemical types
 */
export const ingredientsToChemicals = (ings: Ingredient[]): Chemical[] =>
  ings.map(ingredientToChemical);

/**
 * Convert Chemicals to Ingredient types
 */
export const chemicalsToIngredients = (chems: Chemical[], startAmount = 0): Ingredient[] =>
  chems.map((c) => chemicalToIngredient(c, startAmount));

/**
 * Modify the first ingredient by adding from the second ingredient, then return the reference
 * of the first ingredient
 */
export const mergeIngredient = (target: Ingredient, source: Ingredient): Ingredient => {
  target.startAmount += source.startAmount;
  target.computedAmount += source.computedAmount;

  if (source.computedConsumers) {
    target.computedConsumers = target.computedConsumers ?? {};
    mergeRecords(target.computedConsumers, source.computedConsumers);
  }

  if (source.computedGoalConsumers) {
    target.computedGoalConsumers = target.computedGoalConsumers ?? {};
    mergeRecords(target.computedGoalConsumers, source.computedGoalConsumers);
  }

  return target;
};

// Merge a record type with another (store result back into target)
const mergeRecords = (target: Record<string, Chemical>, source: Record<string, Chemical>) => {
  Object.entries(source).forEach(([id, chemical]) => {
    if (target[id]) {
      target[id].amount += chemical.amount;
    } else {
      target[id] = { ...chemical };
    }
  });
};
