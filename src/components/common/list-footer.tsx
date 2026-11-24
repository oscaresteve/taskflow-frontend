"use client";

import { PageSizeSelect } from "@/components/common/page-size-select";
import { PaginationControls } from "@/components/common/pagination-controls";

// Paginar no es acotar la lista, asi que sus dos controles bajan aqui y dejan la barra para los
// filtros. Uno a cada extremo: cuanto entra en la pagina se elige una vez, y recorrerlas es lo que
// se repite. Lo monta la pantalla solo cuando hay filas.
export function ListFooter({
  limit,
  pageSizeOptions,
  onLimitChange,
  page,
  totalPages,
  onPageChange,
}: {
  limit: number;
  pageSizeOptions: number[];
  onLimitChange: (value: number) => void;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <PageSizeSelect value={limit} options={pageSizeOptions} onChange={onLimitChange} />
      <PaginationControls page={page} totalPages={totalPages} onPageChange={onPageChange} />
    </div>
  );
}
