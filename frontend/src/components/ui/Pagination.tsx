import { Button } from "./Button";

type PaginationProps = {
  page: number;
  pageCount?: number;
  onPageChange: (page: number) => void;
};

export const Pagination = ({ page, pageCount = 1, onPageChange }: PaginationProps) => {
  return (
    <div className="flex items-center justify-between gap-3 text-sm text-slate-500">
      <p>
        Página <span className="font-semibold text-slate-900">{page}</span> de{" "}
        <span className="font-semibold text-slate-900">{pageCount || 1}</span>
      </p>
      <div className="flex items-center gap-2">
        <Button variant="ghost" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
          Anterior
        </Button>
        <Button
          variant="ghost"
          disabled={pageCount <= page}
          onClick={() => onPageChange(page + 1)}
        >
          Siguiente
        </Button>
      </div>
    </div>
  );
};
