import { request } from "@/lib/http/client";
import { SearchResponseDto } from "@/lib/dtos/search.dto";
import { buildQueryString } from "@/lib/http/query-string";

// `limit` es el tope por entidad, no el total: la paleta pide los N mejores espacios, los N
// mejores proyectos y las N mejores tareas.
export function getGlobalSearch({ search, limit }: { search: string; limit?: number }) {
  const queryString = buildQueryString({ search, limit });

  return request<SearchResponseDto>(`/me/search${queryString}`, {
    method: "GET",
  });
}
