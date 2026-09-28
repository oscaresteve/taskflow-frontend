"use client";

import { useCallback, useEffect, useState } from "react";

const SHORTCUT_KEY = "k";

export function useCommandPalette() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === SHORTCUT_KEY && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((previous) => !previous);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const close = useCallback(() => setOpen(false), []);

  return { open, setOpen, close };
}
