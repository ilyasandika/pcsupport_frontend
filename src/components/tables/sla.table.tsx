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
import type {ISlaPolicy} from "@/types/sla.type.ts";

interface SlaPolicyTableProps {
    data: ISlaPolicy[]
    isLoading?: boolean
}

const formatDuration = (seconds: number) => {
    if (seconds == null) return '-';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    const parts: string[] = [];
    if (hours) parts.push(`${hours}h`);
    if (minutes) parts.push(`${minutes}m`);
    if (secs || parts.length === 0) parts.push(`${secs}s`);
    return parts.join(' ');
};

export const SlaPolicyTable = ({data, isLoading = false}: SlaPolicyTableProps) => {
    const columnHelper = createColumnHelper<ISlaPolicy>();

    const columns: ColumnDef<ISlaPolicy, any>[] = useMemo(
	() => [
	    columnHelper.accessor('name', {
		header: 'Name',
		size: 200,
		cell: (info) => {
		    const policy = info.row.original;
		    return (
			<div>
			    <div className="font-semibold">
				{policy.name}
			    </div>
			    <div className="text-xs text-gray-500">
				{policy.description}
			    </div>
			</div>
		    );
		}
	    }),
	    columnHelper.accessor('responseTimeSeconds', {
		header: 'Response Time',
		size: 150,
		cell: (info) => formatDuration(info.getValue()),
	    }),
	    columnHelper.accessor('resolutionTimeSeconds', {
		header: 'Resolution Time',
		size: 150,
		cell: (info) => formatDuration(info.getValue()),
	    }),
	    columnHelper.accessor('isBusinessHourOnly', {
		header: 'Business Hour Only',
		size: 150,
		cell: (info) => (
		    <span className={`px-2 py-1 rounded text-xs font-medium ${
			info.getValue()
			    ? 'bg-green-100 text-green-700'
			    : 'bg-gray-100 text-gray-600'
		    }`}>
                       {info.getValue() ? 'Yes' : 'No'}
                   </span>
		),
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

    const table = useReactTable<ISlaPolicy>({
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

    return (<DataTable table={table} name='All SLA Policies' isLoading={isLoading}/>)

}