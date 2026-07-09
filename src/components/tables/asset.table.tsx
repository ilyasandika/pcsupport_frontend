import {
    type ColumnDef,
    type ColumnFiltersState,
    createColumnHelper,
    getCoreRowModel, getFilteredRowModel, getPaginationRowModel,
    useReactTable
} from "@tanstack/react-table";
import {useMemo, useState} from "react";
import DataTable from "./data-table.tsx";
import {ActionButtons} from "./action-button.tsx";
import type {IDetailAsset} from "@/types/asset.type.ts";

interface AssetTableProps {
    data: IDetailAsset[]
    isLoading?: boolean
}

export const AssetTable = ({data, isLoading = false}: AssetTableProps) =>  {
    const columnHelper = createColumnHelper<IDetailAsset>();
    console.log(data)
    const columns: ColumnDef<IDetailAsset, any>[] = useMemo(
	() => [
	    columnHelper.accessor('assetTag', {
		header: 'Asset Tag',
		size: 200,
		cell: (info) => {
		    const asset = info.row.original;
		    return (
			<div>
			    <div className="font-semibold">
				{asset.assetTag}
			    </div>
			    <div className="text-xs text-gray-500">
				{asset.serialNumber}
			    </div>
			</div>
		    );
		}
	    }),
	    columnHelper.accessor('hostname', {
		header: 'Hostname',
		size: 150,
	    }),
	    columnHelper.accessor(row => {
		if (!row.assetAssignments?.length) return '';
		const status = row.assetAssignments[0].userNonEmployeeName ? row.assetAssignments[0].userNonEmployeeName : 'PIC';
		return `${row.assetAssignments[0].employee.name} ${status}`;
	    }, {
		id: 'user',
		header: 'User / PIC',
		size: 250,
		cell: (info) => {
		    const users = info.row.original.assetAssignments;
		    if (!users || users.length === 0) return <span className="text-gray-400">-</span>;
		    const lastUser = users[0];
		    const employeeName = lastUser.employee?.name || '-';
		    const employeeNik = lastUser.employee?.nik || '-';
		    const nonEmployeeName = lastUser.userNonEmployeeName || 'PIC';
		    return (
			<div>
			    <div className="font-semibold">
				{`${employeeName} (${nonEmployeeName})`}
			    </div>
			    <div className="text-xs text-gray-500">
				{`NIK: ${employeeNik}`}
			    </div>
			</div>
		    );
		}
	    }),
	    columnHelper.accessor(row => row.category.name, {
		header: 'Category',
		size: 100,
		cell: (info) => info.getValue()?.toUpperCase()
	    }),
	    columnHelper.accessor(row => `${row.brand} ${row.model || ''}`.trim(), {
		id: 'brandModel',
		header: 'Brand & Model',
		size: 250,
	    }),
	    columnHelper.accessor(row => row.workLocation?.name, {
		id: 'workLocation',
		header: 'Location',
		size: 150,
	    }),
	    columnHelper.accessor(row => row.project?.vendor?.name, {
		id: 'vendor',
		header: 'Vendor/Project',
		size: 400,
		cell: (info) => {
		    const project = info.row.original.project;
		    return (
			<div>
			    <div className="font-semibold">
				{project.vendor.name}
			    </div>
			    <div className="text-xs text-gray-500">
				{project.name}
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
			detail={{  to: `${info.row.original.serialNumber}` }}
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

    const table = useReactTable<IDetailAsset>({
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

    return (<DataTable table={table} name='All Assets' isLoading={isLoading}/>)

}