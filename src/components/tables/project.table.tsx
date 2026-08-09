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
import type {IProject} from "@/types/project.type.ts";

interface ProjectTableProps {
    data: IProject[]
    isLoading?: boolean
}

export const ProjectTable = ({data, isLoading = false}: ProjectTableProps) => {
    const columnHelper = createColumnHelper<IProject>();

    const columns: ColumnDef<IProject, any>[] = useMemo(
	() => [
	    columnHelper.accessor('name', {
		header: 'Name',
		size: 250,
		cell: (info) => {
		    const project = info.row.original;
		    return (
			<div>
			    <div className="font-semibold">
				{project.name}
			    </div>
			    <div className="text-xs text-gray-500">
				{project.description}
			    </div>
			</div>
		    );
		}
	    }),
	    columnHelper.accessor(row => row.vendor?.name, {
		id: 'vendor',
		header: 'Vendor',
		size: 250,
		cell: (info) => info.row.original.vendor?.name || '-',
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
	const savedSizes = localStorage.getItem('table-column-sizes-project');
	return savedSizes ? JSON.parse(savedSizes) : {};
    });

    useEffect(() => {
	localStorage.setItem('table-column-sizes-project', JSON.stringify(columnSizing));
    }, [columnSizing]);

    const table = useReactTable<IProject>({
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

    return (<DataTable table={table} name='All Projects' isLoading={isLoading}/>)

}