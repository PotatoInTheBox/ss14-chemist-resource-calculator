/**
 * File: reaction.ts
 *
 * Responsibility:
 * - Represent the reaction recipe to turn one chemical to another
 * - A given set of chemicals can be represented to convert to a set of products (accounting for byproducts)
 * - TODO consider whether converting to Chemical improves the code
 * (probably better to leave it as id->amount)
 */

export interface Reaction {
  id: string
  reactants: Record<string, number>
  products: Record<string, number>
  minTemp?: number
}
