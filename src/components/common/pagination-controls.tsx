"use client";

import { useTranslations } from "next-intl";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

// Solo anterior y siguiente: la lista de numeros ocupaba el ancho del pie para una navegacion que
// casi nadie hace pagina a pagina. El contador del medio es entonces lo unico que dice donde estas
// y cuantas paginas hay.
export function PaginationControls({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  // Las etiquetas del primitivo son literales en ingles y no se tocan ahi: se pasan desde aqui.
  const t = useTranslations("common");

  return (
    // El primitivo se centra con mx-auto y w-full, que aqui empujaria el selector.
    <Pagination className="mx-0 w-auto">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            text={t("pagination.previous")}
            aria-label={t("pagination.goToPrevious")}
            aria-disabled={page <= 1}
            className={page <= 1 ? "pointer-events-none opacity-50" : undefined}
            onClick={(e) => {
              e.preventDefault();
              onPageChange(Math.max(1, page - 1));
            }}
          />
        </PaginationItem>
        <PaginationItem>
          <span className="px-2 text-sm tabular-nums">
            <span aria-hidden="true">{`${page} / ${Math.max(totalPages, 1)}`}</span>
            <span className="sr-only">{t("pagination.position", { page, total: Math.max(totalPages, 1) })}</span>
          </span>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext
            href="#"
            text={t("pagination.next")}
            aria-label={t("pagination.goToNext")}
            aria-disabled={page >= totalPages}
            className={page >= totalPages ? "pointer-events-none opacity-50" : undefined}
            onClick={(e) => {
              e.preventDefault();
              onPageChange(Math.min(Math.max(totalPages, 1), page + 1));
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
