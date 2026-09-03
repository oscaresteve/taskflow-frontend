import { PaginatedResponseDto } from "@/lib/dtos/pagination.dto";

// Shared getNextPageParam for useInfiniteQuery against any endpoint that returns
// PaginatedResponseDto — e.g. sidebar "load more" lists today, member lists later.
export function getNextPageParam<T>(lastPage: PaginatedResponseDto<T>): number | undefined {
  return lastPage.pagination.page < lastPage.pagination.pages ? lastPage.pagination.page + 1 : undefined;
}
