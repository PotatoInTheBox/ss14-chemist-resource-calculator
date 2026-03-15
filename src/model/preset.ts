/**
 * File: preset.ts
 *
 * Responsibility:
 * - Represent a generic preset of chemicals
 * - Name represents the title of the preset while the entries contain a list
 * of each chemical and their quantities
 * - The storage of these is fairly generic so it could model either a list of
 * chemicals we want or a list of chemicals we have
 */

import type { Chemical } from "@model/chemical"

export interface Preset {
  name: string
  entries: Chemical[]
}
