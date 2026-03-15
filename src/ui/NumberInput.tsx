/**
 * File: NumberInput.tsx
 *
 * Responsibility:
 * - Allowing the user to input numbers
 */
import { useState, useEffect } from "react";

interface Props {
  value: number; // current number from store
  onChange?: (value: number) => void; // only called for valid numbers
  className?: string;
  style?: React.CSSProperties;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
}

export function NumberInput({
  value,
  onChange,
  className,
  style,
  placeholder,
  min,
  max,
  step,
}: Props) {
  const [inputValue, setInputValue] = useState(String(value));

  // Sync local input if external value changes
  useEffect(() => {
    setInputValue(String(value));
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);

    const num = Number(val);
    if (val !== "" && !isNaN(num)) {
      onChange?.(num);
    }
  };

  return (
    <input
      type="number"
      value={inputValue}
      onChange={handleChange}
      className={className}
      style={style}
      placeholder={placeholder}
      min={min}
      max={max}
      step={step}
    />
  );
}
