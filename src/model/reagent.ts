/**
 * File: reagent.ts
 *
 * Responsibility:
 * - Represent a Reagent and it's properties
 * - While we may use an id for a reagent, we may sometimes want to extract more information
 * about its properties such as the color
 * - TODO add more properties here as needed (descriptions, visual properties)
 */

export interface Reagent {
  id: string;
  color: string;
}

export const UnknownReagent: Reagent = {
  id: "UNKNOWN REAGENT",
  color: "#555",
};

