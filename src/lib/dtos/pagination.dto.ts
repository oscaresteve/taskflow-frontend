export const sortOrders = ["asc", "desc"] as const;
export type SortOrder = (typeof sortOrders)[number];

export interface PaginationDto {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface PaginatedResponseDto<T> {
  data: T[];
  pagination: PaginationDto;
}
