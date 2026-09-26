import { Pagination } from "./pagination";

export type PaginatedResult<T> = {
  items: T[];
  metaData: Pagination
}
