"use client";

import { useCallback, useEffect, useState } from "react";

const SHORTCUT_KEY = "k";

export function useCommandPalette() {
  const [open, setOpen] = useState(false);
  // El texto vive aqui y no en la paleta porque hay que descartarlo en todas las vias de cierre, y
  // ⌘K no pasa por el onOpenChange del Dialog (ese solo se dispara cuando el popup se cierra solo).
  const [search, setSearch] = useState("");

  const changeOpen = useCallback((next: boolean) => {
    setOpen(next);
    if (!next) setSearch("");
  }, []);

  const close = useCallback(() => changeOpen(false), [changeOpen]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === SHORTCUT_KEY && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        // Limpiar sin mirar si abre o cierra: al abrir no hay nada que descartar, porque el cierre
        // anterior ya lo hizo.
        setSearch("");
        setOpen((previous) => !previous);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return { open, setOpen: changeOpen, close, search, setSearch };
}
