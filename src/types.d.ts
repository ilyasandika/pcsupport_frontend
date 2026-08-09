import "@tanstack/react-table";

export type FilterOption = string | number | { label: string; value: string | number };

declare module "@tanstack/react-table" {
    interface ColumnMeta<TData extends RowData, TValue> {
        filterVariant?: "multi-select" | "text" | "date";
        filterOptions?: FilterOption[];
    }
}
