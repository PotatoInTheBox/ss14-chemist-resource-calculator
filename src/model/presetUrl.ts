/**
 * File: preset.ts
 *
 * Responsibility:
 * - Encode and decode presets in URL
 */

import type { Chemical } from "@model/chemical";

export interface ShareData {
  ingredients: Chemical[];
  goals: Chemical[];
}

/** Encode ingredients and goals into a URL-safe string */
export function encodePreset(ingredients: Chemical[], goals: Chemical[]): string {
  const data: ShareData = {
    ingredients: ingredients.filter((c) => c.amount !== 0),
    goals,
  };
  return encodeURIComponent(JSON.stringify(data));
}

/** Decode a URL (query param or full URL) back into ingredients and goals */
export function decodePreset(url: string): ShareData | null {
  try {
    // If it’s a full URL, extract the ?preset= part
    let param = url;
    if (url.includes("?")) {
      const params = new URL(url).searchParams;
      param = params.get("preset") ?? "";
    }
    if (!param) return null;

    const data: ShareData = JSON.parse(decodeURIComponent(param));
    // Optionally validate structure
    if (!data.ingredients || !data.goals) return null;
    return data;
  } catch (e) {
    console.error("Failed to decode preset URL", e);
    return null;
  }
}
