import {
    type ColumnDef,
    type ColumnFiltersState,
    createColumnHelper,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    useReactTable
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import Table from "./table.tsx";
import { ActionButtons } from "./action-button.tsx";
import type {IUser} from "../../types/user.type.ts";

interface UserTableProps {
    data: IUser[];
    isLoading?: boolean;
}

export const UserTable = ({ data, isLoading = false }: UserTableProps) => {
    const columnHelper = createColumnHelper<IUser>();

    const columns: ColumnDef<IUser, any>[] = useMemo(
	() => [
	    columnHelper.accessor('username', {
		header: 'Username',
		size: 150,
	    }),
	    columnHelper.accessor('fullName', {
		header: 'Full Name',
		size: 250,
		cell: (info) => (
		    <div>
			<div className="font-semibold">{info.getValue()}</div>
			<div className="text-xs text-gray-500">{info.row.original.email}</div>
		    </div>
		)
	    }),
	    columnHelper.accessor('role', {
		header: 'Role',
		size: 150,
		cell: (info) => {
		    const role = info.getValue();
		    let badgeColor = "bg-gray-100 text-gray-800";

		    if (role === 'admin') badgeColor = "bg-red-100 text-red-800";
		    if (role === 'engineer') badgeColor = "bg-blue-100 text-blue-800";
		    if (role === 'helpdesk') badgeColor = "bg-green-100 text-green-800";

		    return (
			<span className={`px-2 py-1 rounded-md text-xs font-medium uppercase ${badgeColor}`}>
                            {role}
                        </span>
		    );
		}
	    }),
	    columnHelper.accessor('active', {
		header: 'Status',
		size: 120,
		cell: (info) => {
		    const isActive = info.getValue();
		    return (
			<span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
			    isActive ? 'bg-emerald-100 text-emerald-850' : 'bg-rose-100 text-rose-850'
			}`}>
                            {isActive ? 'Active' : 'Inactive'}
                        </span>
		    );
		}
	    }),
	    columnHelper.accessor('createdAt', {
		header: 'Created At',
		size: 200,
		cell: (info) => {
		    const rawValue = info.getValue();
		    if (!rawValue) return '-';
		    return new Date(rawValue).toLocaleTimeString('en-UK', {
			day: 'numeric',
			month: '2-digit',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
			timeZone: 'Asia/Jakarta'
		    });
		}
	    }),
	    columnHelper.display({
		id: 'actions',
		header: 'Actions',
		size: 150,
		cell: (info) => (
		    <ActionButtons
			edit={{ onClick: () => console.log('edit user id:', info.row.original.id) }}
			document={{ onClick: () => console.log('view document user id:', info.row.original.id) }}
			remove={{ onClick: () => console.log('remove user id:', info.row.original.id) }}
		    />
		),
	    }),
	],
	[]
    );

    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });

    const table = useReactTable<IUser>({
	data,
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

    return <Table table={table} name='All Users' isLoading={isLoading} />;
};