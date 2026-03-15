/**
 * File: ChemicalUsage.tsx
 * * Responsibility:
 * - Render a list of chemicals with their amounts and reagent colors
 */

import type { Chemical } from "@model/chemical";
import { UnknownReagent } from "@model/reagent";
import { useStore } from "@state/store";
import { formatNumber } from "@ui/uiHelper";

import { Container } from "react-bootstrap";

interface Props {
  chemicals: Chemical[];
}

export function ChemicalUsage({ chemicals }: Props) {
  const { reagents } = useStore();

  if (chemicals.length === 0) return null;

  return (
    <Container className="d-flex flex-wrap gap-1 mt-2 border-top pt-2">
      {chemicals.map((c) => {
        const reagent = reagents.get(c.id) || UnknownReagent;
        return (
          <div
            key={c.id}
            className="px-2 py-0 rounded"
            style={{
              border: `2px solid ${reagent.color}`,
              fontSize: "0.75rem",
            }}
          >
            {c.id}: {formatNumber(c.amount)}
          </div>
        );
      })}
    </Container>
  );
}
