export interface Pagination {
  page?: number;
  totalResults?: number;
  pageSize?: number;
}

export interface PaginationFilter {
  page: number;
  size: number;
}

export const defaultPagination: Pagination = {};

export const defaultPaginationFilter: PaginationFilter = {
  page: 1,
  size: 10,
};
