"use client";

import { Fragment, type ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { PaginationControls } from "@/components/common/pagination-controls";
import { SearchInput } from "@/components/common/search-input";
import type { useSearchableGrid } from "@/hooks/use-searchable-grid";
import { cn } from "@/lib/utils";

interface SearchableGridProps<T> {
  title: string;
  searchPlaceholder: string;
  errorLabel: string;
  /** Se pinta cuando no hay resultados; el llamante decide si el mensaje es de busqueda o de vacio. */
  emptyState: ReactNode;
  /** Clase de columnas de la rejilla, compartida por las tarjetas y por el esqueleto. */
  columns: string;
  /** Alto de cada hueco del esqueleto, para que se parezca a la tarjeta que va a ocupar su sitio. */
  skeletonClassName: string;
  /** Tantos huecos como tarjetas caben en una pagina. */
  pageSize: number;
  state: ReturnType<typeof useSearchableGrid>;
  result?: { data: T[]; pagination: { pages: number } };
  isError: boolean;
  className?: string;
  children: (item: T) => ReactNode;
}

// El armazon que comparten las tres rejillas de overview: cabecera con buscador, los cuatro estados
// (error, cargando, vacio, con datos) y la paginacion. Solo cambian las tarjetas y el texto.
export function SearchableGrid<T extends { id: string }>({
  title,
  searchPlaceholder,
  errorLabel,
  emptyState,
  columns,
  skeletonClassName,
  pageSize,
  state,
  result,
  isError,
  className,
  children,
}: SearchableGridProps<T>) {
  const grid = cn("grid gap-3", columns);

  return (
    <section className={cn("flex flex-col gap-3", className)}>
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-heading text-base leading-snug font-medium">{title}</h2>
        <SearchInput
          value={state.search}
          onChange={state.onSearchChange}
          placeholder={searchPlaceholder}
          className="w-48"
        />
      </div>

      {isError ? (
        <p className="text-sm text-muted-foreground">{errorLabel}</p>
      ) : !result ? (
        <div className={grid}>
          {Array.from({ length: pageSize }).map((_, index) => (
            <Skeleton key={index} className={cn("w-full", skeletonClassName)} />
          ))}
        </div>
      ) : result.data.length === 0 ? (
        emptyState
      ) : (
        <div className={grid}>
          {result.data.map((item) => (
            <Fragment key={item.id}>{children(item)}</Fragment>
          ))}
        </div>
      )}

      {result && result.pagination.pages > 1 && (
        <PaginationControls page={state.page} totalPages={result.pagination.pages} onPageChange={state.onPageChange} />
      )}
    </section>
  );
}
