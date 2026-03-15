/**
 * File: uiHelper.ts
 *
 * Responsibility:
 * - Generic helper functions shared across files to help the UI with common needs
 */

export function formatNumber(n: number): string {
  return n % 1 !== 0 ? n.toFixed(2) : n + "";
}