/**
 * File: PresetControl.tsx
 *
 * Responsibility:
 * - UI element for loading/storing Presets from storage
 */

import { useState, useEffect } from "react";
import type { Preset } from "@model/preset";
// import type { Chemical } from "@model/chemical";
import {
  presetExists,
  // createPreset, // C
  loadPresets, // R
  // U
  deletePreset, // D
} from "@store/presets";
import {
  Button,
  ButtonGroup,
  Container,
  Dropdown,
  DropdownButton,
} from "react-bootstrap";

interface PresetControlProps {
  title: string;
  type: "ingredients" | "goals";
  onAdd: (preset: Preset) => void;
  onLoad: (preset: Preset) => void;
  onSave?: (name: string) => void;
}

export function PresetControl({
  title,
  type,
  onAdd,
  onLoad,
  onSave,
}: PresetControlProps) {
  const [presets, setPresets] = useState<Preset[]>([]);
  const [selected, setSelected] = useState("");

  useEffect(() => {
    setPresets(loadPresets(type));
  }, [type]);

  const handleAdd = () => {
    const preset = presets.find((p) => p.name === selected);
    if (preset) onAdd(preset);
  };

  const handleLoad = () => {
    const preset = presets.find((p) => p.name === selected);
    if (preset) onLoad(preset);
  };

  const handleSave = () => {
    // It's literally so simple that I kinda don't want to touch it into
    // a Bootstrap solution...
    const name = prompt("Enter a unique preset name");
    if (!name) return;
    if (presetExists(type, name)) {
      alert("Name already exists");
      return;
    }
    if (onSave) onSave(name); // Call onSave if the function is defined
    // Refresh the corresponding list (so the user can see it)
    setPresets(loadPresets(type));
  };

  const handleDelete = () => {
    if (!selected) return;
    if (!confirm(`Delete preset "${selected}"?`)) return;
    deletePreset(type, selected);
    setSelected("");
    // Refresh the corresponding list (so the user can see it)
    setPresets(loadPresets(type));
  };

  return (
    <Container>
      <h3>{title}</h3>
      <DropdownButton
        className="mb-1 preset-dropdown-fix"
        title={selected || "Select Preset"}
        onSelect={(key) => setSelected(key || "")}
      >
        {presets.map((p) => (
          <Dropdown.Item key={p.name} eventKey={p.name}>
            {p.name}
          </Dropdown.Item>
        ))}
      </DropdownButton>
      <ButtonGroup className="d-flex gap-1">
        <Button className="btn-sm btn-success" onClick={handleAdd}>
          Add
        </Button>
        <Button className="btn-sm btn-primary" onClick={handleLoad}>
          Load
        </Button>
        <Button className="btn-sm btn-secondary" onClick={handleSave}>
          Save
        </Button>
        <Button className="btn-sm btn-danger" onClick={handleDelete}>
          Delete
        </Button>
      </ButtonGroup>
    </Container>
  );
}
