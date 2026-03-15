/**
 * File: App.tsx
 *
 * Responsibility:
 * - Setting up global objects
 * - Global layout
 * - Connecting various high level components
 * - Temporary work not yet delegated to other files
 */

import {
  lastRetrieved,
  reactions as loadedReactions,
  reagents as loadedReagents,
} from "@data/loadReactionsReagents";
import { calculate } from "@engine/calculate";
import { getChemicalUsage } from "@engine/calculateHelpers";
import { useTheme } from "@hooks/useTheme";
import type { Chemical } from "@model/chemical";
import { ingredientsToChemicals, mergeIngredient } from "@model/conversions";
import type { Ingredient } from "@model/ingredient";
import { decodePreset, type ShareData } from "@model/presetUrl";
import { useStore } from "@state/store";
import { createPreset } from "@store/presets";
import { AddGoal } from "@ui/AddGoal";
import { GoalCard } from "@ui/cards/GoalCard";
import { IngredientCard, type ViewMode } from "@ui/cards/IngredientCard";
import { IntermediaryCard } from "@ui/cards/IntermediaryCard";
import { PresetControl } from "@ui/PresetControl";
import { SharePreset } from "@ui/Share";
import { useEffect, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";

export default function App() {
  const {
    reagents,
    reactionsByProduct,
    goals,
    ingredients,
    initialIngredients,
    intermediates,
    setData,
    setResults,
    updateGoal,
    addGoal,
    removeGoal,
    updateIngredient,
    addIngredient,
    removeIngredient,
    removeAllIngredients: removeAllIngredient,
    removeAllGoals,
  } = useStore();
  const { theme, setTheme } = useTheme();
  const [globalViewMode, setGlobalViewMode] =
    useState<ViewMode>("intermediary");

  // view mode for progress bars inside of ingredient cards
  const toggleMode = () => {
    setGlobalViewMode((prev) =>
      prev === "intermediary" ? "goal" : "intermediary",
    );
  };

  // Decode preset from URL on mount (on startup)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const presetParam = params.get("preset");
    if (!presetParam) return;

    const data: ShareData | null = decodePreset(presetParam);
    if (!data) return;

    // Apply ingredients
    data.ingredients.forEach((c: Chemical) => {
      // Your updateIngredient logic
      updateIngredient(c.id, c.amount);
    });

    // Apply goals
    data.goals.forEach((c: Chemical) => {
      updateGoal(c.id, c.amount);
    });
  }, [updateIngredient, updateGoal]);

  // Run at startup
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) =>
      setTheme(e.matches ? "dark" : "light");

    mediaQuery.addEventListener("change", handler);
    setTheme(mediaQuery.matches ? "dark" : "light");

    return () => mediaQuery.removeEventListener("change", handler);
  }, [setTheme]);

  // Run at startup (note will run twice if in strict mode)
  useEffect(() => {
    // Map JSON arrays into Maps keyed by reagent id / product id
    const reagentMap = new Map(loadedReagents.map((r) => [r.id, r]));
    const reactionsMap = new Map(loadedReactions.map((r) => [r.id, r]));

    // --- VERIFY / AUTOGENERATE MISSING REAGENTS ---
    // Unlikely error but in the event I'm missing a reagent I still want it
    // to render something.
    for (const reaction of reactionsMap.values()) {
      const check = (id: string) => {
        if (!reagentMap.has(id)) {
          console.warn(`Missing reagent "${id}" - auto-generated`);
          reagentMap.set(id, {
            id,
            color: "gray",
          });
        }
      };

      Object.keys(reaction.reactants).forEach(check);
      Object.keys(reaction.products).forEach(check);
    }

    setData(reagentMap, reactionsMap);
  }, [setData]);

  // Run when data deps are modified
  useEffect(() => {
    const i = new Map<string, Ingredient>();
    const m = new Map<string, number>();

    // Load ingredients with startAmount into i
    for (const [k, ingredient] of initialIngredients) {
      if (ingredient.startAmount != 0) {
        i.set(k, {
          id: ingredient.id,
          computedAmount: 0,
          startAmount: ingredient.startAmount,
        });
      }
    }

    // calculate ingredients and intermediaries from our goal into i
    for (const [id, chem] of goals) {
      const r = calculate(id, chem.amount, reactionsByProduct);
      for (const [k, v] of r.ingredients) {
        const currentIngredient = i.get(k);
        if (currentIngredient) {
          mergeIngredient(currentIngredient, v);
          i.set(k, currentIngredient);
        } else {
          i.set(k, v);
        }
      }
      r.intermediates.forEach((v, k) => m.set(k, (m.get(k) ?? 0) + v));
    }

    setResults(i, m);
  }, [goals, initialIngredients, reactionsByProduct, setResults]);

  // Top level structure of the App
  return (
    <Container>
      <Button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
        Switch to {theme === "light" ? "Dark" : "Light"} Mode
      </Button>
      {createPresetRow()}
      {createCardListRow()}
      {/* sneak in a timestamp */}
      {createRetrievalTimestamp()}
    </Container>
  );

  // Row responsible for controlling the lists
  function createPresetRow() {
    return (
      <Row>
        <Col xs={12} md={4}>
          {createIngredientPresetControl()}
        </Col>
        <Col xs={12} md={4}>
          <SharePreset
            ingredients={ingredientsToChemicals([
              ...initialIngredients.values(),
            ])}
            goals={[...goals.values()]}
          />
        </Col>
        <Col xs={12} md={4}>
          {createGoalPresetControl()}
        </Col>
      </Row>
    );
  }

  // Preset control for loading/saving ingredients
  function createIngredientPresetControl() {
    return (
      <PresetControl
        title="Ingredient Presets"
        type="ingredients"
        onAdd={(preset) => {
          console.log("Added preset:", preset.name, preset.entries);
          preset.entries.forEach((chem) => {
            addIngredient(chem.id, chem.amount);
          });
        }}
        onLoad={(preset) => {
          console.log("Loaded preset:", preset.name, preset.entries);
          removeAllIngredient();
          preset.entries.forEach((chem) => {
            updateIngredient(chem.id, chem.amount);
          });
        }}
        onSave={(name) => {
          createPreset("ingredients", {
            name,
            entries: ingredientsToChemicals([...ingredients.values()]),
          });
        }}
      />
    );
  }

  // Preset control for loading/saving goals
  function createGoalPresetControl() {
    return (
      <PresetControl
        title="Goal Presets"
        type="goals"
        onAdd={(preset) => {
          console.log("Added preset:", preset.name, preset.entries);
          preset.entries.forEach((chem) => {
            addGoal(chem.id, chem.amount);
          });
        }}
        onLoad={(preset) => {
          console.log("Loaded preset:", preset.name, preset.entries);
          // Apply it to your store
          removeAllGoals();
          preset.entries.forEach((chem) => {
            updateGoal(chem.id, chem.amount);
          });
        }}
        onSave={(name) => {
          createPreset("goals", { name, entries: [...goals.values()] });
        }}
      />
    );
  }

  // Card list row structure
  function createCardListRow() {
    return (
      <Row>
        <Col xs={12} md={4} className="card-list">
          {createIngredientList()}
        </Col>
        <Col xs={12} md={4} className="card-list">
          {createIntermediaryList()}
        </Col>
        <Col xs={12} md={4} className="card-list">
          {createGoalList()}
        </Col>
      </Row>
    );
  }

  // List of all ingredients
  function createIngredientList() {
    return (
      <>
        <h1>Ingredients</h1>
        {sortMapById(ingredients).map(([id, ingredient]) => (
          <IngredientCard
            key={id}
            reagent={reagents.get(id)} // I don't like this, undefined errors are easy to miss.
            ingredient={ingredient}
            viewMode={globalViewMode}
            // Replace .get() with an alternative. If "id" doesn't match,
            // I'd like to have logic to better debug the issue (such as a typo)
            onChange={(newStartAmount) => {
              if (typeof newStartAmount === "number") {
                if (newStartAmount == 0) {
                  removeIngredient(id);
                } else {
                  updateIngredient(id, newStartAmount);
                }
              }
            }}
            onClearPress={() => {
              removeIngredient(id);
            }}
            toggleMode={toggleMode}
          />
        ))}
      </>
    );
  }

  // List of all intermediaries
  function createIntermediaryList() {
    return (
      <>
        <h1>Intermediates</h1>
        {sortMapById(intermediates).map(([id, amt]) => (
          <IntermediaryCard
            key={id}
            reagent={reagents.get(id)}
            amount={amt}
            chemicalDeps={getChemicalUsage(
              { id, amount: amt },
              reactionsByProduct,
            )}
          />
        ))}
      </>
    );
  }

  // List of all goals as well as a button for adding a new one
  function createGoalList() {
    return (
      <>
        <h1>Goals</h1>
        <AddGoal />
        {sortMapById(goals).map(([id, chem]) => (
          <GoalCard
            key={id}
            reagent={reagents.get(id)}
            amount={chem.amount}
            onChange={(v) => updateGoal(id, v === "" ? 0 : v)}
            onClosePress={() => removeGoal(id)}
            chemicalDeps={getChemicalUsage(chem, reactionsByProduct)}
          />
        ))}
      </>
    );
  }
}

// Helper to sort Map entries by key (id)
function sortMapById<T>(map: Map<string, T>) {
  return [...map.entries()].sort(([idA], [idB]) => idA.localeCompare(idB));
}

// Quick helper to get a timestamp of when we last got the data to deal
// with the possibility of recipe or name changes
function createRetrievalTimestamp(): JSX.Element {
  const formattedDate = new Date(lastRetrieved).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return (
    <Container
      className="text-center mt-5 mb-2"
      style={{ opacity: 0.25, fontSize: "0.75rem" }}
    >
      Data retrieved from Official SS14 Prototypes on {formattedDate}
    </Container>
  );
}
