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
import type {IDetailWorkLocation} from "@/types/work-location.type.ts"

interface WorkLocationTableProps {
    data: IDetailWorkLocation[]
    isLoading?: boolean
}

export const WorkLocationTable = ({data, isLoading = false}: WorkLocationTableProps) => {
    const columnHelper = createColumnHelper<IDetailWorkLocation>();
    const columns: ColumnDef<IDetailWorkLocation, any>[] = useMemo(
	() => [
	    columnHelper.accessor('name', {
		header: 'Name',
		size: 200,
		cell: (info) => {
		    const location = info.row.original;
		    return (
			<div>
			    <div className="font-semibold">
				{location.name}
			    </div>
			    <div className="text-xs text-gray-500">
				{location.description}
			    </div>
			</div>
		    );
		}
	    }),
	    columnHelper.accessor('address', {
		header: 'Address',
		size: 300,
		cell: (info) => info.getValue() || '-',
	    }),
	    columnHelper.accessor(row => `${row.latitude}, ${row.longitude}`, {
		id: 'coordinates',
		header: 'Coordinates',
		size: 200,
		cell: (info) => {
		    const location = info.row.original;
		    if (location.latitude == null || location.longitude == null) {
			return <span className="text-gray-400">-</span>;
		    }
		    return (
			<div>
			    <div className="text-xs text-gray-500">
				Lat: {location.latitude}
			    </div>
			    <div className="text-xs text-gray-500">
				Long: {location.longitude}
			    </div>
			</div>
		    );
		}
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
	const savedSizes = localStorage.getItem('table-column-sizes');
	return savedSizes ? JSON.parse(savedSizes) : {};
    });

    useEffect(() => {
	localStorage.setItem('table-column-sizes', JSON.stringify(columnSizing));
    }, [columnSizing]);

    const table = useReactTable<IDetailWorkLocation>({
	data,
	columns,
	state: {
	    columnFilters,
	    pagination,
	    columnSizing
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

    return (<DataTable table={table} name='All Work Locations' isLoading={isLoading}/>)

}