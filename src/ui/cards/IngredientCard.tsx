/**
 * File: IngredientCard.tsx
 *
 * Responsibility:
 * - Card structure for showing the ingredient amount and letting the user modify it
 */

import { reagentsMap } from "@data/loadReactionsReagents";
import type { Chemical } from "@model/chemical";
import type { Ingredient } from "@model/ingredient";
import { UnknownReagent, type Reagent } from "@model/reagent";
import { BaseCard } from "@ui/cards/BaseCard";
import { NumberInput } from "@ui/NumberInput";
import { formatNumber } from "@ui/uiHelper";
import { Button, Container, ProgressBar } from "react-bootstrap";

interface Props {
  reagent: Reagent | undefined;
  ingredient: Ingredient;
  viewMode: ViewMode;
  onChange?: (value: number | "") => void;
  onClearPress?: () => void;
  toggleMode: () => void;
}

export type ViewMode = "intermediary" | "goal";

export function IngredientCard({
  reagent,
  ingredient,
  viewMode,
  onChange,
  onClearPress,
  toggleMode,
}: Props) {
  // Make sure it's not undefined so we don't deref an undefined
  const r: Reagent = reagent ? reagent : UnknownReagent;

  const totalSign = ingredient.computedAmount >= 0 ? "+" : "-";
  const displayAmount = Math.abs(ingredient.computedAmount);

  // Colors
  const consumptionColor = ingredient.computedAmount < 0 ? "text-danger" : "";
  const resultColor =
    ingredient.startAmount + ingredient.computedAmount >= 0
      ? "text-success"
      : "text-danger";

  // Only define a clear button if the start amount is not 0!
  // (User won't see any changes if they try to clear when it's already 0,
  // to avoid misleading them we will remove it)
  const onClearPressOptional =
    onClearPress && ingredient.startAmount != 0 ? onClearPress : undefined;

  return (
    <BaseCard title={r.id} color={r.color} onClear={onClearPressOptional}>
      {/* Spent so long tweaking it, I don't want to Bootstrap-ify this */}
      <Container className={`d-flex align-items-center font-monospace gap-1`}>
        {/* (#) Result on far left */}
        <span
          className={`flex-fill text-center ${resultColor}`}
          style={{ width: 100 }}
        >
          {formatNumber(ingredient.startAmount + ingredient.computedAmount)}
        </span>
        {/* (=) Equal sign */}
        <span className={`mx-1`}>=</span>
        {/* (#) Editable startAmount */}
        <NumberInput
          value={ingredient.startAmount}
          onChange={(n) => onChange?.(n)}
          className="form-control form-control-sm text-center flex-fill"
          style={{ width: 100, minWidth: 0 }}
        />
        {/* (+/-) Sign */}
        <span className={`mx-1`}>{totalSign}</span>
        {/* (#) amount */}
        <span
          className={`flex-fill text-center ${consumptionColor}`}
          style={{ width: 100 }}
        >
          {formatNumber(displayAmount)}
        </span>
      </Container>
      <Button
        onClick={toggleMode}
        style={{
          background: "none",
          border: "none",
          padding: 0,
          width: "100%",
          cursor: "pointer",
        }}
      >
        <ProgressBar className="mt-2">
          {createProgressBars(ingredient, viewMode)}
        </ProgressBar>
      </Button>
    </BaseCard>
  );
}

function createProgressBars(
  ingredient: Ingredient,
  type = "intermediary",
): JSX.Element[] {
  let computedConsumersList;
  if (type == "intermediary") {
    computedConsumersList = Object.entries(
      ingredient.computedConsumers ?? {},
    ).sort();
  } else {
    // type == "goal"
    computedConsumersList = Object.entries(
      ingredient.computedGoalConsumers ?? {},
    ).sort();
  }

  const chemicalsOnly: Chemical[] = computedConsumersList.map(
    ([id, chemical]) => {
      return { ...chemical, id };
    },
  );

  return chemicalsOnly.map(({ id, amount }) => {
    const barSize = ingredient.startAmount > 0 ? ingredient.startAmount : 1;
    let reagent = reagentsMap.get(id);
    reagent = reagent ? reagent : UnknownReagent;

    const isStriped = type == "intermediary" ? true : false;

    return (
      <ProgressBar
        striped={isStriped}
        animated={isStriped}
        now={(100 * amount) / barSize}
        style={{ backgroundColor: reagent.color }}
        key={id}
        className="instant-tooltip"
        data-tooltip={`${id}: ${formatNumber(amount)}`}
      />
    );
  });
}
