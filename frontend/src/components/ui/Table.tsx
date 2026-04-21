import { ReactNode } from "react";
import { cn } from "../../lib/utils/cn";

export type Column<T> = {
  key: string;
  header: string;
  className?: string;
  render: (item: T) => ReactNode;
};

type TableProps<T> = {
  columns: Column<T>[];
  data: T[];
  rowKey: (item: T) => string;
  className?: string;
};

export const Table = <T,>({ columns, data, rowKey, className }: TableProps<T>) => {
  return (
    <div className={cn("overflow-hidden rounded-3xl border border-slate-200", className)}>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-slate-50">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-4 py-3 text-left text-xs font-bold uppercase tracking-[0.25em] text-slate-500"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={rowKey(item)} className="border-t border-slate-100">
                {columns.map((column) => (
                  <td key={column.key} className={cn("px-4 py-4 text-sm text-slate-700", column.className)}>
                    {column.render(item)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
