// Page of results in the PagedModel shape that Spring Data sends in VIA_DTO mode.
export interface Page<T> {
  readonly content: readonly T[];
  readonly page: PageMetadata;
}

// number is zero-based, the first page is 0 just like Pageable in Spring Data.
export interface PageMetadata {
  readonly size: number;
  readonly number: number;
  readonly totalElements: number;
  readonly totalPages: number;
}
