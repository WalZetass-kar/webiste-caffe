"use client";
"use no memo";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { cn } from "@/lib/utils";

type DataTableProps<TData> = {
  data: TData[];
  columns: ColumnDef<TData>[];
};

export function DataTable<TData>({ data, columns }: DataTableProps<TData>) {
  // TanStack Table returns a managed instance object, so we opt this hook out of React Compiler linting.
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-hidden rounded-xl border border-cafe-line bg-cafe-surface shadow-md">
      <div className="overflow-x-auto">
        <table className="min-w-[640px] w-full text-left text-sm text-cafe-text">
          <thead className="bg-cafe-secondary/55 text-xs uppercase tracking-[0.24em] text-cafe-accent/90">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-4 py-4 font-semibold">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-t border-cafe-line/70 transition-colors hover:bg-cafe-secondary/20">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className={cn("px-4 py-4")}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
