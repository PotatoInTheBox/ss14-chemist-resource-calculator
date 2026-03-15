/**
 * File: AddGoal.tsx
 *
 * Responsibility:
 * - UI element for adding new goals that don't already exist
 */

import { useStore } from "@state/store";

export function AddGoal() {
  const { reagents, updateGoal } = useStore();

  const reagentIds = [...reagents.keys()].sort((a, b) => a.localeCompare(b));

  if (reagentIds.length === 0) return <div>Loading reagents...</div>;

  return (
    <div>
      <input
        list="reagent-list"
        placeholder="Add Goal..."
        className="p-1 rounded"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            const inputVal = e.currentTarget.value.toLowerCase();
            // Handle lowercase cuz I can't do a simple key lookup
            // TODO maybe optimize but realistically there are only so many chemicals
            // in the game
            const actualId = [...reagents.keys()].find(
              (id) => id.toLowerCase() === inputVal,
            );
            if (actualId) {
              updateGoal(actualId, 90);
              e.currentTarget.value = "";
            }
          }
        }}
      />
      <datalist id="reagent-list">
        {reagentIds.map((id) => (
          <option key={id} value={id} />
        ))}
      </datalist>
    </div>
  );
}
