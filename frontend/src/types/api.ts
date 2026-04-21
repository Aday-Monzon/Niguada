export type ApiEnvelope<T> = {
  data: T;
  meta?: {
    page: number;
    pageSize: number;
    total: number;
    pageCount: number;
  };
  error: {
    message: string;
    details?: unknown;
  } | null;
};

export type PaginatedResult<T> = {
  items: T[];
  meta?: ApiEnvelope<T[]>["meta"];
};
