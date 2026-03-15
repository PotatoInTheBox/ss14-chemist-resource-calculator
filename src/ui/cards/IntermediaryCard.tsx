/**
 * File: IntermediaryCard.tsx
 *
 * Responsibility:
 * - Card structure for showing the intermediary amounts
 */

import { UnknownReagent, type Reagent } from "@model/reagent";
import { BaseCard } from "@ui/cards/BaseCard";
import { formatNumber } from "@ui/uiHelper";
import { ChemicalUsage } from "@ui/cards/ChemicalUsage";
import type { Chemical } from "@model/chemical";

import { Container } from "react-bootstrap";

interface Props {
  reagent: Reagent | undefined;
  amount: number;
  chemicalDeps: Chemical[];
}

export function IntermediaryCard({ reagent, amount, chemicalDeps }: Props) {
  // Make sure it's not undefined so we don't deref an undefined
  const r: Reagent = reagent ? reagent : UnknownReagent;
  return (
    <BaseCard title={r.id} color={r.color}>
      <Container color="#e56060">{formatNumber(amount)}</Container>
      <ChemicalUsage chemicals={chemicalDeps} />
    </BaseCard>
  );
}
