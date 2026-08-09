import {
    type ColumnDef,
    type ColumnFiltersState,
    createColumnHelper,
    getCoreRowModel, getFilteredRowModel, getPaginationRowModel,
    useReactTable
} from "@tanstack/react-table";
import {useEffect, useMemo, useState} from "react";
import DataTable from "./data-table.tsx";
import {ActionButtons} from "./action-button.tsx";
import type {IVendor} from "@/types/vendor.type.ts";

interface VendorTableProps {
    data: IVendor[]
    isLoading?: boolean
}

export const VendorTable = ({data, isLoading = false}: VendorTableProps) => {
    const columnHelper = createColumnHelper<IVendor>();

    const columns: ColumnDef<IVendor, any>[] = useMemo(
	() => [
	    columnHelper.accessor('name', {
		header: 'Name',
		size: 300,
		cell: (info) => (
		    <div className="font-semibold">
			{info.getValue()}
		    </div>
		)
	    }),
	    columnHelper.display({
		id: 'actions',
		header: 'Actions',

		cell: (info) => (
		    <ActionButtons
			detail={{  to: `${info.row.original.id}` }}
			edit={{ to: `${'#'}` }}
			generateDocument={{  to: `${'#'}` }}
			remove={{  to: `${'#'}` }}
		    />
		),
	    }),
	],
	[]
    );

    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });
    const [columnSizing, setColumnSizing] = useState(() => {
	const savedSizes = localStorage.getItem('table-column-sizes-vendor');
	return savedSizes ? JSON.parse(savedSizes) : {};
    });

    useEffect(() => {
	localStorage.setItem('table-column-sizes-vendor', JSON.stringify(columnSizing));
    }, [columnSizing]);

    const table = useReactTable<IVendor>({
	data,
	columns,
	state: {
	    columnFilters,
	    pagination,
	    columnSizing,
	},
	renderFallbackValue: '-',
	onColumnFiltersChange: setColumnFilters,
	onPaginationChange: setPagination,
	columnResizeMode: 'onChange',
	onColumnSizingChange: setColumnSizing,
	getCoreRowModel: getCoreRowModel(),
	getFilteredRowModel: getFilteredRowModel(),
	getPaginationRowModel: getPaginationRowModel(),
    });

    return (<DataTable table={table} name='All Vendors' isLoading={isLoading}/>)

}