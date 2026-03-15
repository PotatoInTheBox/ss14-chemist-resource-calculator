/**
 * File: BaseCard.tsx
 *
 * Responsibility:
 * - Represent the base card structure for how every single card should look like
 */

import type { ReactNode } from "react";

import { Card, CloseButton, Container } from "react-bootstrap";

interface Props {
  title: string;
  color: string;
  children: ReactNode;
  onClear?: () => void; // if defined then a close button will appear on the top right
}

export function BaseCard({ title, color, children, onClear: onClear }: Props) {
  return (
    <Card
      className="bg-gray-800 p-2 rounded shadow border-top-0 border-bottom-0 border-end-0"
      style={{ borderLeft: `6px solid ${color}`, position: "relative" }}
    >
      <Card.Title>{title}</Card.Title>
      {/* Card.Body and Card.Text screws up the formatting too much. Container is more compact */}
      <Container>
        {onClear && (
          <CloseButton
            className="position-absolute top-0 end-0 m-1 p-0"
            onClick={() => onClear()}
          ></CloseButton>
        )}
      </Container>

      {children}
    </Card>
  );
}
