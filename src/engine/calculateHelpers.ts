import type { Chemical } from "@model/chemical"
import type { Ingredient } from "@model/ingredient";
import type { Reaction } from "@model/reaction"

// export function getReactants(reaction: Reaction | undefined): Chemical[] {
//   if (!reaction || !reaction.reactants) {
//     return []; 
//   }
//   return Object.entries(reaction.reactants ?? {}).map(([id, amount]) => ({id, amount}));
// }

// export function getProducts(reaction: Reaction | undefined): Chemical[] {
//   if (!reaction || !reaction.products) {
//     return []; 
//   }
//   return Object.entries(reaction.products ?? {}).map(([id, amount]) => ({id, amount}));
// }

// Return the needed chemicals to produce the given chemical
export function getChemicalUsage(chemical: Chemical, reactionsByProduct: Map<string, Reaction>): Chemical[] {
  const reaction = reactionsByProduct.get(chemical.id);

  if (!reaction || !reaction.reactants || !reaction.products) return [];

  const multiplier = chemical.amount / reaction.products[chemical.id]

  // subtract reactants by products 
  return Object.entries(reaction.reactants ?? {}).map(([id, amount]) => {
    const producedAmount = reaction.products[id] ?? 0;
    
    return {id, amount: multiplier * (amount - producedAmount)};
  });
}

// Add a consumer to the ingredient by adding a chemical to it
export function addIngredientConsumer(ingredient: Ingredient, chemical: Chemical): void {
  // ensure it is defined since we want to write to it
  ingredient.computedConsumers = ingredient.computedConsumers ?? {};
  // ensure our ingredient is defined since we want to write to it
  const consumerChem = ingredient.computedConsumers[chemical.id] ?? {id: chemical.id, amount: 0}
  consumerChem.amount += chemical.amount
  ingredient.computedConsumers[chemical.id] = consumerChem;
}


// Add a goal consumer to the ingredient by adding a chemical to it
export function addIngredientGoalConsumer(ingredient: Ingredient, chemical: Chemical): void {
  // ensure it is defined since we want to write to it
  ingredient.computedGoalConsumers = ingredient.computedGoalConsumers ?? {};
  // ensure our ingredient is defined since we want to write to it
  const consumerGoalChem = ingredient.computedGoalConsumers[chemical.id] ?? {id: chemical.id, amount: 0}
  consumerGoalChem.amount += chemical.amount
  ingredient.computedGoalConsumers[chemical.id] = consumerGoalChem;
}
