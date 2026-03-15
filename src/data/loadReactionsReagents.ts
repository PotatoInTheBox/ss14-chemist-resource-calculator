/**
 * File: loadReactionsReagents.ts
 *
 * Responsibility:
 * - Load the JSON data into their typed models
 * - Specifically, we load into REACTION and REAGENT
 */

import reagentsJson from '@data/reagents.json'
import reactionsJson from '@data/reactions.json'
import type { Reaction } from "@model/reaction";
import type { Reagent } from "@model/reagent";

// Map JSON directly to typed objects on initialize
export const reagents: Reagent[] = reagentsJson.map(r => ({
  id: r.id,
  color: r.color
}))

export const reactions: Reaction[] = reactionsJson.map(r => ({
  id: r.id,
  reactants: r.reactants as Record<string, number>,
  products: r.products as Record<string, number>,
  minTemp: r.minTemp
}))

export const reagentsMap = new Map<string, Reagent>(
  reagents.map(r => [r.id, r])
);

export const reactionsMap = new Map<string, Reaction>(
  reactions.map(r => [r.id, r])
);
