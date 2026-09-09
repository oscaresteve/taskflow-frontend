import { useSyncExternalStore } from "react";

function emptySubscribe() {
  return () => {};
}

export function useHasMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}
