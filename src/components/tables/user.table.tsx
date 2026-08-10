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
import DataTable from "./data-table.tsx";
import { ActionButtons } from "./action-button.tsx";
import type {IDetailUser} from "../../types/user.type.ts";
import {UserRepository} from "@/data/repositories/user.repository.ts";
import {Info} from "lucide-react";
import {ChangePasswordDialogContent} from "@/features/user/components/change-password-dialog-content.tsx";
import {UploadSignatureDialog} from "@/features/user/components/upload-signature-dialog.tsx";

interface UserTableProps {
    data: IDetailUser[];
    isLoading?: boolean;
}

export const UserTable = ({ data, isLoading = false }: UserTableProps) => {
    const columnHelper = createColumnHelper<IDetailUser>();
    const [openChangePasswordDialog, setOpenChangePasswordDialog] = useState(false);
    const [openUploadSignatureDialog, setOpenUploadSignatureDialog] = useState(false);
    const [selectedId, setSelectedId] = useState<number>()
    const [selectedUserForSignature, setSelectedUserForSignature] = useState<{ id: number; fullName: string } | null>(null);

    const columns: ColumnDef<IDetailUser, any>[] = useMemo(
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
	    columnHelper.accessor('signaturePath', {
		header: 'Signature',
		size: 130,
		cell: (info) => {
		    const hasSig = !!info.getValue();
		    return (
			<span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
			    hasSig ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
			}`}>
                            {hasSig ? 'Uploaded' : 'No Signature'}
                        </span>
		    );
		}
	    }),
	    columnHelper.display({
		id: 'actions',
		header: 'Actions',
		size: 180,
		cell: (info) => {
		    const user = info.row.original;
		    const id = user.id;
		    return (
			<ActionButtons
			    detail={{
				to: `${id}`,
				tooltip: "Detail User"
			    }}
			    edit={{
				to: `${id}/update`,
				tooltip: "Edit User"
			    }}
			    uploadDocument={{
				onClick: () => {
				    setSelectedUserForSignature({ id: user.id, fullName: user.fullName });
				    setOpenUploadSignatureDialog(true);
				},
				tooltip: "Upload Signature"
			    }}
			    seeDocument={user.signaturePath ? {
				onClick: () => UserRepository.viewSignature(user.id),
				tooltip: "View Signature"
			    } : undefined}
			    keyButton={{
				onClick: () => {
				    setOpenChangePasswordDialog(true)
				    setSelectedId(id)
				},
				tooltip: "Change Password"
			    }}
			    remove={{
				alert:{
				    title: 'Remove User',
				    description: 'Are you sure to remove this user? this action cannot be undone!',
				    onContinue: () => UserRepository.deleteUser(id),
				    variant: 'danger',
				    icon: <Info className={"text-danger w-4 h-4"}/>
				},
				tooltip: "Remove User"
			    }}
			/>
		    )
		},
	    }),
	],
	[]
    );

    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });

    const table = useReactTable<IDetailUser>({
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
	columnResizeMode: 'onChange',
	getFilteredRowModel: getFilteredRowModel(),
	getPaginationRowModel: getPaginationRowModel(),
    });

    return (
	<>
	    <ChangePasswordDialogContent open={openChangePasswordDialog}
					 setOpen={setOpenChangePasswordDialog}
					 id={selectedId}
	    />
	    <UploadSignatureDialog open={openUploadSignatureDialog}
				   onOpenChange={setOpenUploadUploadSignatureDialog => setOpenUploadSignatureDialog(openUploadUploadSignatureDialog)}
				   userId={selectedUserForSignature?.id}
				   userName={selectedUserForSignature?.fullName}
	    />
	    <DataTable table={table}
		       name='All Users'
		       isLoading={isLoading}
		       create={{
			   label: "create new user",
			   to: "/users/create",
		       }}
	    />
	</>
    )
};