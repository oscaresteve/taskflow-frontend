import { debounce, parseAsBoolean, parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import { useDebouncedValue } from "./use-debounced-value";

// Estado de una rejilla con buscador, filtro de favoritos y paginacion: vive en la URL, asi que
// sobrevive al refresco y se puede compartir. La usan las tres rejillas de overview (espacios,
// proyectos y tareas).
export function useSearchableGrid() {
  const [{ search, isFavorite, page }, setQuery] = useQueryStates({
    search: parseAsString.withDefault("").withOptions({ limitUrlUpdates: debounce(300) }),
    isFavorite: parseAsBoolean.withDefault(false),
    page: parseAsInteger.withDefault(1),
  });

  const searchParam = useDebouncedValue(search) || undefined;

  function onSearchChange(value: string) {
    setQuery({ search: value, page: 1 });
  }

  function onFavoriteChange(value: boolean) {
    setQuery({ isFavorite: value, page: 1 });
  }

  function onPageChange(value: number) {
    setQuery({ page: value });
  }

  return {
    search,
    isFavorite,
    page,
    searchParam,
    onSearchChange,
    onFavoriteChange,
    onPageChange,
  };
}
