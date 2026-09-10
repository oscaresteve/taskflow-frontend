import { InfiniteData } from "@tanstack/react-query";
import { PaginatedResponseDto } from "@/lib/dtos/pagination.dto";

// Shared getNextPageParam for useInfiniteQuery against any endpoint that returns
// PaginatedResponseDto — e.g. sidebar "load more" lists today, member lists later.
export function getNextPageParam<T>(lastPage: PaginatedResponseDto<T>): number | undefined {
  return lastPage.pagination.page < lastPage.pagination.pages ? lastPage.pagination.page + 1 : undefined;
}

// The backend doesn't guarantee a fully stable order (createdAt/joinedAt ties), so the same row
// can land on two different pages once "load more" fires. Wired as `select` on the
// infiniteQueryOptions factories that back the member pickers, so every consumer of `data.pages`
// gets an already-deduped result without having to think about pagination drift.
export function dedupeInfinitePages<T extends { id: string }>(
  data: InfiniteData<PaginatedResponseDto<T>, number>
): InfiniteData<PaginatedResponseDto<T>, number> {
  const seen = new Set<string>();
  return {
    ...data,
    pages: data.pages.map((page) => ({
      ...page,
      data: page.data.filter((item) => {
        if (seen.has(item.id)) return false;
        seen.add(item.id);
        return true;
      }),
    })),
  };
}
