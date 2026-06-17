import {
    type ColumnDef,
    type ColumnFiltersState,
    createColumnHelper,
    getCoreRowModel, getFilteredRowModel, getPaginationRowModel,
    useReactTable
} from "@tanstack/react-table";
import {useEffect, useMemo, useState} from "react";
import Table from "./table.tsx";
import {ActionButtons} from "./action-button.tsx";
import type {IAsset} from "../../types/asset.type.ts";
import {AssetRepository} from "../../data/repositories/asset.repository.tsx";

export const AssetTable = () =>  {
    const [assets, setAssets] = useState<IAsset[]>([]);

    useEffect(()=> {
	const loadAssets = async () => {
	    await AssetRepository.getAssets()
		.then((data) => setAssets(data))
	}

	loadAssets();
    }, [])

    const columnHelper = createColumnHelper<IAsset>();
    const columns: ColumnDef<IAsset, any>[] = useMemo(
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
		if (!row.user) return '';
		const status = row.user.userNonEmployee ? row.user.userNonEmployee : 'PIC';
		return `${row.user.name} ${status}`;
	    }, {
		id: 'user',
		header: 'User / PIC',
		size: 250,
		cell: (info) => {
		    const user = info.row.original.user;
		    if (!user) return <span className="text-gray-400">-</span>;
		    return (
			<div>
			    <div className="font-semibold">
				{`${user.name} (${user.userNonEmployee ? user.userNonEmployee : 'PIC'})`}
			    </div>
			    <div className="text-xs text-gray-500">
				{`NIK: ${user.nik ? user.nik : '-'}`}
			    </div>
			</div>
		    );
		}
	    }),
	    columnHelper.accessor('category', {
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

    const table = useReactTable<IAsset>({
	data : assets,
	columns,
	state: {
	    columnFilters,
	    pagination,
	},
	renderFallbackValue: '-',
	onColumnFiltersChange: setColumnFilters,
	onPaginationChange: setPagination,
	getCoreRowModel: getCoreRowModel(),
	getFilteredRowModel: getFilteredRowModel(),
	getPaginationRowModel: getPaginationRowModel(),
    });

    return (<Table table={table} name='All Assets' />)

}