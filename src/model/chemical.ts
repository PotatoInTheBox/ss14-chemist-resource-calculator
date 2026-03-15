/**
 * File: chemical.ts
 *
 * Responsibility:
 * - Represent an arbritrary chemical
 * - A chemical name and an amount
 * - Can be either an ingredient, intermediary, or goal
 */

export interface Chemical {
    id: string
    amount: number
}