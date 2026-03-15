/**
 * File: GoalCard.tsx
 *
 * Responsibility:
 * - Card structure for showing the goal amount and letting the user modify it
 */

import type { Chemical } from "@model/chemical";
import { UnknownReagent, type Reagent } from "@model/reagent";
import { BaseCard } from "@ui/cards/BaseCard";
import { ChemicalUsage } from "@ui/cards/ChemicalUsage";
import { NumberInput } from "@ui/NumberInput";

interface Props {
  reagent: Reagent | undefined;
  amount: number;
  onChange: (value: number | "") => void;
  onClosePress: () => void;
  chemicalDeps: Chemical[];
}

export function GoalCard({
  reagent,
  amount,
  onChange,
  onClosePress,
  chemicalDeps,
}: Props) {
  // Make sure it's not undefined so we don't deref an undefined
  const r: Reagent = reagent ? reagent : UnknownReagent;
  return (
    <BaseCard title={r.id} color={r.color} onClear={onClosePress}>
      <NumberInput
        value={amount}
        onChange={(n) => onChange(n)}
        className="form-control form-control-sm text-left"
      />
      <ChemicalUsage chemicals={chemicalDeps} />
    </BaseCard>
  );
}
