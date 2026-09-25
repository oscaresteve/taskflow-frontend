import { debounce, parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import { useDebouncedValue } from "./use-debounced-value";

export function useFavoritesGrid() {
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
