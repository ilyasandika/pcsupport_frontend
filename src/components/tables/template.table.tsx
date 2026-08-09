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
import {TemplateType, type ITemplate} from "@/types/template.type.ts";

interface TemplateTableProps {
    data: ITemplate[]
    isLoading?: boolean
}

const templateTypeLabel: Record<TemplateType, string> = {
    [TemplateType.Ticket]: 'Ticket',
    [TemplateType.BastAssign]: 'BAST Assign',
    [TemplateType.BastReturn]: 'BAST Return',
    [TemplateType.BastBackup]: 'BAST Backup',
};

export const TemplateTable = ({data, isLoading = false}: TemplateTableProps) => {
    const columnHelper = createColumnHelper<ITemplate>();

    const columns: ColumnDef<ITemplate, any>[] = useMemo(
	() => [
	    columnHelper.accessor('type', {
		header: 'Type',
		size: 150,
		cell: (info) => (
		    <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-700">
                       {templateTypeLabel[info.getValue() as TemplateType] ?? info.getValue()}
                   </span>
		),
	    }),
	    columnHelper.accessor('name', {
		header: 'Name',
		size: 200,
		cell: (info) => {
		    const template = info.row.original;
		    return (
			<div>
			    <div className="font-semibold">
				{template.name}
			    </div>
			    <div className="text-xs text-gray-500">
				{template.description}
			    </div>
			</div>
		    );
		}
	    }),
	    columnHelper.accessor('filePath', {
		header: 'File',
		size: 250,
		cell: (info) => {
		    const filePath = info.getValue();
		    if (!filePath) return <span className="text-gray-400">-</span>;
		    const fileName = filePath.split('/').pop();
		    return (
			<span className="text-xs text-gray-600 truncate">
                           {fileName}
                       </span>
		    );
		},
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
	const savedSizes = localStorage.getItem('table-column-sizes-template');
	return savedSizes ? JSON.parse(savedSizes) : {};
    });

    useEffect(() => {
	localStorage.setItem('table-column-sizes-template', JSON.stringify(columnSizing));
    }, [columnSizing]);

    const table = useReactTable<ITemplate>({
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

    return (<DataTable table={table} name='All Templates' isLoading={isLoading}/>)

}