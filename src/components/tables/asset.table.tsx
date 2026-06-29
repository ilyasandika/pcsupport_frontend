import {
    type ColumnDef,
    type ColumnFiltersState,
    createColumnHelper,
    getCoreRowModel, getFilteredRowModel, getPaginationRowModel,
    useReactTable
} from "@tanstack/react-table";
import {useMemo, useState} from "react";
import Table from "./table.tsx";
import {ActionButtons} from "./action-button.tsx";
import type {IDetailAsset} from "../../types/asset.type.ts";

interface AssetTableProps {
    data: IDetailAsset[]
    isLoading?: boolean
}

export const AssetTable = ({data, isLoading = false}: AssetTableProps) =>  {
    const columnHelper = createColumnHelper<IDetailAsset>();
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
		if (!row.assetAssignment) return '';
		const status = row.assetAssignment.userNonEmployee ? row.assetAssignment.userNonEmployee : 'PIC';
		return `${row.assetAssignment.employee.name} ${status}`;
	    }, {
		id: 'user',
		header: 'User / PIC',
		size: 250,
		cell: (info) => {
		    const user = info.row.original.assetAssignment;
		    if (!user) return <span className="text-gray-400">-</span>;
		    return (
			<div>
			    <div className="font-semibold">
				{`${user.employee.name} (${user.userNonEmployee ? user.userNonEmployee : 'PIC'})`}
			    </div>
			    <div className="text-xs text-gray-500">
				{`NIK: ${user.employee.name ? user.employee.nik : '-'}`}
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

	    columnHelper.accessor('purchaseDate', {
		header: 'Purchase Date',
		size: 150,
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
	    columnHelper.accessor('warrantyDate', {
		header: 'Warranty Expired',
		size: 150,
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
	    // Display column untuk tombol aksi
	    columnHelper.display({
		id: 'actions',
		header: 'Actions',
		size: 120,
		cell: () => (
		    <ActionButtons
			edit={{ onClick: () => console.log('edit') }}
			document={{ onClick: () => console.log('document') }}
			remove={{ onClick: () => console.log('remove') }}
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

    return (<Table table={table} name='All Assets' isLoading={isLoading}/>)

}