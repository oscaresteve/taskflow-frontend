import { debounce, parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import { useDebouncedValue } from "./use-debounced-value";

// Estado de una rejilla con buscador y paginacion: vive en la URL, asi que sobrevive al refresco y
// se puede compartir. La usan las tres rejillas de overview (espacios, proyectos y tareas).
export function useSearchableGrid() {
  const [{ search, page }, setQuery] = useQueryStates({
    search: parseAsString.withDefault("").withOptions({ limitUrlUpdates: debounce(300) }),
    page: parseAsInteger.withDefault(1),
  });

  const searchParam = useDebouncedValue(search) || undefined;

  function onSearchChange(value: string) {
    setQuery({ search: value, page: 1 });
  }

  function onPageChange(value: number) {
    setQuery({ page: value });
  }

  return {
    search,
    page,
    searchParam,
    onSearchChange,
    onPageChange,
  };
}
