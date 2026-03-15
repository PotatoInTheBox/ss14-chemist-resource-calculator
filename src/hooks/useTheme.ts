/**
 * Note to self:
 * A hook is a function that will allow me to hook onto react features.
 * In this case I'm hooking the bootstrap light/dark feature into my code
 * which is expecting light/dark behavior. (It looks for "setTheme")
 */

import { useState, useEffect } from "react";

export function useTheme() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    document.body.setAttribute("data-bs-theme", theme);
  }, [theme]);

  return { theme, setTheme };
}