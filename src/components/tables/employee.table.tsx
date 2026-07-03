import {
    type ColumnDef,
    type ColumnFiltersState,
    createColumnHelper,
    getCoreRowModel, getFilteredRowModel, getPaginationRowModel,
    useReactTable
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import Table from "./table.tsx";
import { ActionButtons } from "./action-button.tsx";
import type { IEmployee } from "../../types/employee.type.ts";

interface EmployeeTableProps {
    data: IEmployee[]
    isLoading?: boolean
}

export const EmployeeTable = ({ data, isLoading = false }: EmployeeTableProps) => {
    const columnHelper = createColumnHelper<IEmployee>();
    const columns: ColumnDef<IEmployee, any>[] = useMemo(
	() => [
	    columnHelper.accessor('name', {
		header: 'Name / NIK',
		size: 250,
		cell: (info) => {
		    const employee = info.row.original;
		    return (
			<div>
			    <div className="font-semibold">
				{employee.name}
			    </div>
			    <div className="text-xs text-gray-500">
				{`NIK: ${employee.nik || '-'}`}
			    </div>
			</div>
		    );
		}
	    }),
	    columnHelper.accessor('contractType', {
		header: 'Contract',
		size: 120,
		cell: (info) => {
		    const type = info.getValue();
		    return (
			<span className={`px-2 py-0.5 text-xs font-semibold rounded uppercase ${
			    type === 'organik' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'
			}`}>
                            {type}
                        </span>
		    );
		}
	    }),
	    columnHelper.accessor(row => `${row.position} ${row.department}`, {
		header: 'Position',
		size: 400,
		cell: (info) => {
		    const employee = info.row.original;
		    return (
			<div>
			    <div className="font-semibold text-sm">
				{employee.position}
			    </div>
			    <div className="text-xs text-gray-500">
				{employee.department}
			    </div>
			</div>
		    );
		}
	    }),
	    // columnHelper.accessor(row => `${row.directorate} ${row.division} ${row.department}`, {
		// id: 'organization',
		// header: 'Organization Unit',
		// size: 300,
		// cell: (info) => {
		//     const emp = info.row.original;
		//     return (
		// 	<div className="text-sm">
		// 	    <div className="font-medium text-gray-700">{emp.department || '-'}</div>
		// 	    <div className="text-xs text-gray-500">
		// 		{`${emp.division || '-'} • ${emp.directorate || '-'}`}
		// 	    </div>
		// 	</div>
		//     );
		// }
	    // }),
	    columnHelper.accessor('religion', {
		header: 'Religion',
		size: 150,
		cell: (info) => info.getValue() ? info.getValue().toUpperCase() : '-'
	    }),
	    columnHelper.accessor('retireDate', {
		header: 'Retirement Date',
		size: 180,
		cell: (info) => {
		    const rawValue = info.getValue();
		    if (!rawValue) return '-';
		    return new Date(rawValue).toLocaleDateString('id-ID', {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		    });
		}
	    }),
	    columnHelper.accessor('status', {
		header: 'Status',
		size: 150,
		cell: (info) => {
		    const active = info.getValue();
		    return (
			<span className={`px-2 py-0.5 text-xs font-semibold rounded uppercase ${
			    active ? 'bg-ptba-green/10 text-ptba-green' : 'bg-ptba-red/10 text-ptba-red'
			}`}>
                            {active ? 'active' : 'inactive'}
                        </span>
		    );
		}
	    }),
	    // Display column untuk tombol aksi (Persis AssetTable)
	    columnHelper.display({
		id: 'actions',
		header: 'Actions',
		size: 120,
		cell: (info) => (
		    <ActionButtons
			detail={{  to: `${info.row.original.id}` }}
			edit={{ to: `${'#'}` }}
			document={{  to: `${'#'}` }}
			remove={{  to: `${'#'}` }}
		    />
		),
	    }),
	],
	[]
    );

    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });

    const table = useReactTable<IEmployee>({
	data,
	columns,
	state: {
	    columnFilters,
	    pagination,
	},
	renderFallbackValue: '-',
	onColumnFiltersChange: setColumnFilters,
	onPaginationChange: setPagination,
	columnResizeMode: 'onChange',
	getCoreRowModel: getCoreRowModel(),
	getFilteredRowModel: getFilteredRowModel(),
	getPaginationRowModel: getPaginationRowModel(),
    });

    return (<Table table={table} name='All Employees' isLoading={isLoading} />)
}