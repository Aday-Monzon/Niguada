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
    <div className={cn("overflow-hidden rounded-xl border border-zinc-200/80 bg-white shadow-sm", className)}>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-zinc-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {data.map((item) => (
              <tr key={rowKey(item)} className="transition-colors hover:bg-zinc-50">
                {columns.map((column) => (
                  <td key={column.key} className={cn("px-4 py-4 text-sm text-zinc-700", column.className)}>
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
