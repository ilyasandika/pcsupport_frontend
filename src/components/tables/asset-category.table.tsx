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
import type {IAssetCategory} from "@/types/asset-category.type.ts";

interface AssetCategoryTableProps {
    data: IAssetCategory[]
    isLoading?: boolean
}

export const AssetCategoryTable = ({data, isLoading = false}: AssetCategoryTableProps) => {
    const columnHelper = createColumnHelper<IAssetCategory>();

    const columns: ColumnDef<IAssetCategory, any>[] = useMemo(
	() => [
	    columnHelper.accessor('name', {
		header: 'Name',
		size: 250,
		cell: (info) => (
		    <div className="font-semibold">
			{info.getValue()}
		    </div>
		)
	    }),
	    columnHelper.accessor('description', {
		header: 'Description',
		size: 400,
		cell: (info) => info.getValue() || '-',
	    }),
	    // Display column untuk tombol aksi
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
	const savedSizes = localStorage.getItem('table-column-sizes-asset-category');
	return savedSizes ? JSON.parse(savedSizes) : {};
    });

    useEffect(() => {
	localStorage.setItem('table-column-sizes-asset-category', JSON.stringify(columnSizing));
    }, [columnSizing]);

    const table = useReactTable<IAssetCategory>({
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

    return (<DataTable table={table} name='All Asset Categories' isLoading={isLoading}/>)

}