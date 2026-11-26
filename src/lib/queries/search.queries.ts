import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import { getGlobalSearch } from "@/lib/api/search.api";
import { searchKeys } from "@/lib/query-keys/search.keys";

// Mientras llega la respuesta de la nueva consulta se siguen enseñando los resultados
// anteriores (keepPreviousData) para que la lista no parpadee en vacio entre pulsacion y pulsacion.
export const getGlobalSearchQuery = ({ search, limit }: { search: string; limit?: number }) =>
  queryOptions({
    queryKey: searchKeys.global({ search, limit }),
    queryFn: () => getGlobalSearch({ search, limit }),
    enabled: !!search,
    placeholderData: keepPreviousData,
  });
