// src\app\(dashboard)\components\ui\Table.tsx
import React from "react";

interface Column {
  key: string;
  label: string;
  render?: (value: any, row: any) => React.ReactNode;
  className?: string;
}

interface TableProps {
  columns: Column[];
  data: any[];
  emptyMessage?: string;
  emptyIcon?: React.ElementType;
  onRowClick?: (row: any) => void;
}

export const Table: React.FC<TableProps> = ({
  columns,
  data,
  emptyMessage = "Tidak ada data",
  emptyIcon: EmptyIcon,
  onRowClick,
}) => {
  if (data.length === 0) {
    return (
      <div className="text-center py-10">
        {EmptyIcon && (
          <EmptyIcon className="w-14 h-14 mx-auto mb-3 text-gray-400" />
        )}
        <p className="text-gray-600 text-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-gray-700">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`text-left py-3 px-3 font-medium ${
                    column.className || ""
                  }`}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr
                key={row.id || index}
                className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${
                  onRowClick ? "cursor-pointer" : ""
                } ${index % 2 === 0 ? "bg-white" : "bg-gray-25"}`}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={`py-2.5 px-3 ${column.className || ""}`}
                  >
                    {column.render
                      ? column.render(row[column.key], row)
                      : row[column.key]}
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
