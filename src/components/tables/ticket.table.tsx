import {
    type ColumnDef,
    createColumnHelper,
} from "@tanstack/react-table";
import {
    useMemo,
    useRef,
    useState
} from "react";
import DataTable from "./data-table.tsx";
import {ActionButtons} from "./action-button.tsx";
import {type ITicket, TicketStatus} from "@/types/ticket.type.ts";
import {getStatusBadgeStyle} from "@/helper/style-helper.tsx";
import {
    isTicketCancelled,
    isTicketOpen,
    isTicketSolved
} from "../../helper/helper.tsx";
import {TicketRepository} from "@/data/repositories/ticket.repository.ts";
import {WorkLocationRepository} from "@/data/repositories/work-location.repository.ts";
import {AssetCategoryRepository} from "@/data/repositories/asset-category.repository.ts";
import {CloseTicketDialog} from "@/features/ticket/components/close-ticket-dialog.tsx";
import {useAuth} from "@/context/AuthContext.tsx";
import {useNotificationDialog} from "@/context/NotificationDialogContext.tsx";
import {UploadFile} from "@/components/upload-file.tsx";
import {GeneratePdfDialog} from "@/features/user/components/generate-pdf-dialog.tsx";
import {useMutation, useQuery} from "@tanstack/react-query";
import {DialogContainer} from "@/components/dialog-container.tsx";
import {Badge} from "../ui/badge.tsx";
import {useServerTable} from "@/hooks/use-server-table.ts";
import {useApproveTicket} from "@/features/ticket/hooks/use-approve-ticket.ts";
import {useClaimTicket} from "@/features/ticket/hooks/use-claim-ticket.ts";
import {useDeleteTicket} from "@/features/ticket/hooks/use-delete-ticket.ts";


export const TicketTable = () => {
    const [selectedTicket, setSelectedTicket] = useState<ITicket>({} as ITicket);
    const {showNotification} = useNotificationDialog()
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [openGeneratePdfDialog, setOpenGeneratePdfDialog] = useState<boolean>(false);
    const [openUploadPdfDialog, setOpenUploadPdfDialog] = useState<boolean>(false);

    const [_a, setFile] = useState<File | null>(null)
    const fileRef = useRef<File | null>(null);

    const {isEngineer, isAdmin, isHelpdesk, isSupervisor, user, isAuthLoading} = useAuth()


    const deleteTicketPdfMutation = useMutation({
	mutationFn: (ticketId: number) => TicketRepository.deleteUploadedPdf(ticketId),
	onSuccess: () => {
	    showNotification({
		variant: "success",
		title: "Document Deleted",
		description: "Uploaded ticket PDF document has been deleted successfully",
		onClose: () => window.location.reload(),
	    });
	},
	onError: (error: any) => {
	    showNotification({
		variant: "error",
		title: "Failed to delete document",
		description: error.message || "Failed to delete uploaded document",
	    });
	},
    });

    const uploadTicket = async (id: number, file: File | null) => {
	if (!file) {
	    showNotification({
		variant: "error",
		title: "File must be selected",
		description: "File cannot be empty",
		onClose: () => window.location.reload(),
	    })
	    return
	}
	try {
	    await TicketRepository.uploadTicket(id, file)
	    showNotification({
		variant: "success",
		title: "Ticket file has been uploaded",
		description: "Ticket file has been uploaded successfully",
		onClose: () => window.location.reload(),
	    })
	} catch (e) {
	    showNotification({
		variant: "error",
		title: "Ticket file failed to upload",
		description: "Ticket file failed to upload",
		onClose: () => window.location.reload(),
	    })
	}
    };
    const {data: locations} = useQuery({
	queryKey: ['work-locations'],
	queryFn: () => WorkLocationRepository.getAll(),
    });

    const locationOptions = useMemo(() => {
	return (locations)?.map((loc) => ({label: loc.name, value: loc.id})) || [];
    }, [locations]);

    const {data: assetCategories} = useQuery({
	queryKey: ['asset-categories'],
	queryFn: () => AssetCategoryRepository.getAll(),
    });

    const categoryOptions = useMemo(() => {
	return assetCategories?.map((cat) => ({label: cat.name, value: cat.name})) || [];
    }, [assetCategories]);
    const {mutate: approveTicket} = useApproveTicket()
    const {mutate: claimTicket} = useClaimTicket()
    const {mutate: deleteTicket} = useDeleteTicket()

    const columnHelper = createColumnHelper<ITicket>();
    const columns: ColumnDef<ITicket, any>[] = useMemo(
	() => [
	    columnHelper.accessor('status', {
		id: "status",
		header: 'Status',
		size: 240,
		meta: {
		    filterVariant: 'multi-select',
		    filterOptions: Object.values(TicketStatus),
		},
		cell: (info) => {
		    const value = info.getValue()
		    const ticket = info.row.original
		    const docLabel = ticket.isAssetAssignment ? 'BAST' : 'WO';

		    const currentStyle = getStatusBadgeStyle(value) || ''
		    const isNeedBackup = Boolean((ticket as any).backUpAsset || (ticket as any).isNeedBackup);
		    return (
			<div className="flex flex-col gap-1 w-full">
			    <Badge className={`${currentStyle} capitalize`}>
				{value}
			    </Badge>
			    {isNeedBackup && (
				<Badge variant="outline"
				       className="text-[10px] bg-amber-50 text-amber-700 border-amber-300">
				    Need Backup
				</Badge>
			    )}
			    {(!ticket.filePath && isTicketSolved(ticket.status)) &&
                                <Badge variant="destructive">Upload {docLabel}</Badge>}
			    {(!ticket.approvedBy && isTicketSolved(ticket.status)) && (
				<Badge variant="outline" className="bg-orange-50 text-orange-700">
				    Need Approval
				</Badge>
			    )}
			</div>
		    )
		}
	    }),

	    columnHelper.display({
		id: 'actions',
		header: 'Actions',
		size: 200,
		cell: (info) => {
		    const ticket = info.row.original;

		    const isPrivilegedRole = isAdmin() || isHelpdesk() || isSupervisor();
		    const isAssignedEngineer = isEngineer() && ticket?.engineer?.id === user?.sub;
		    const hasAccess = isAuthLoading ? false : (isPrivilegedRole || isAssignedEngineer);

		    const isOpen = isTicketOpen(ticket.status);
		    const isSolved = isTicketSolved(ticket.status);
		    const isCancelled = isTicketCancelled(ticket.status);
		    const isClosed = isTicketSolved(ticket.status);

		    const isFinishedState = isSolved || isClosed || isCancelled;

		    const hasPdf = Boolean(ticket.filePath);
		    const isNeedBackup = Boolean((ticket as any).backUpAsset || (ticket as any).isNeedBackup);
		    const docLabel = ticket.isAssetAssignment ? 'BAST' : 'WO';

		    const disableRemove = !hasAccess || !(isOpen && !ticket.fullNumber);
		    const disableGenerateUpload = !hasAccess || hasPdf || !(isSolved || isClosed);

		    const disableSeeDelete = !hasAccess || !hasPdf;

		    return (
			<ActionButtons
			    approve={{
				tooltip: ticket.approvedBy ? `Approved by ${ticket.approvedBy.fullName || 'Supervisor'}` : 'Approve Ticket',
				disabled: !isSupervisor() || Boolean(ticket.approvedBy),
				alert: {
				    title: "Approve Ticket",
				    description: `Are you sure you want to approve Ticket ${ticket.fullNumber}?`,
				    variant: "success",
				    onContinue: () => approveTicket(ticket.id),
				}
			    }}
			    detail={{
				to: `${ticket.id}`,
				tooltip: 'Detail Ticket',
			    }}
			    edit={{
				to: `/tickets/${ticket.id}/update`,
				tooltip: 'Edit Ticket',
				disabled: !hasAccess,
			    }}
			    externalTicket={{
				to: `/external-tickets/create?ticketId=${ticket.id}&ticketFullNumber=${encodeURIComponent(ticket.fullNumber || '')}`,
				tooltip: 'Create External Ticket (Escalate to Vendor)',
				disabled: !hasAccess || !isNeedBackup,
			    }}
			    generateDocument={{
				onClick: () => {
				    setSelectedTicket(ticket)
				    setOpenGeneratePdfDialog(true)
				},
				tooltip: `Generate ${docLabel}`,
				disabled: disableGenerateUpload
			    }}
			    remove={{
				tooltip: 'Remove Ticket',
				alert: {
				    title: "Are you sure remove this ticket?",
				    description: "This action cannot be undone",
				    variant: "danger",
				    onContinue: () => deleteTicket(ticket.id),
				},
				disabled: disableRemove
			    }}
			    check={{
				onClick: () => {
				    setSelectedTicket(ticket)
				    setOpenDialog(true)
				},
				tooltip: 'Close Ticket',
				disabled: !hasAccess || isFinishedState || isOpen || isSupervisor()
			    }}

			    addDocument={{
				tooltip: `Claim Ticket`,
				alert: {
				    title: `Claim Ticket`,
				    description: `Are you sure you want to claim this ticket?`,
				    onContinue: () => claimTicket(ticket.id),
				},
				disabled: isSupervisor() || isHelpdesk() || !isOpen,
			    }}

			    uploadDocument={{
				tooltip: `Upload ${docLabel}`,
				alert: {
				    title: `Upload ${docLabel}`,
				    description: "Upload PDF Max: 1 MB",
				    content: <UploadFile
					label={`${docLabel} PDF`}
					description={`Select a ${docLabel} PDF File to upload.`}
					setFile={setFile}
					fileRef={fileRef}
					acceptedFileTypes=".pdf"
				    />,
				    onContinue: () => uploadTicket(ticket.id, fileRef.current)
				},
				disabled: disableGenerateUpload
			    }}
			    seeDocument={{
				onClick: () => {
				    TicketRepository.getSolvedTicketPdf(ticket.id)
				},
				tooltip: `See ${docLabel}`,
				disabled: disableSeeDelete
			    }}
			    deleteDocument={{
				tooltip: `Delete Uploaded ${docLabel}`,
				alert: {
				    title: `Delete Uploaded ${docLabel}`,
				    description: `Are you sure you want to delete the uploaded ticket ${docLabel} PDF document?`,
				    variant: "danger",
				    onContinue: () => deleteTicketPdfMutation.mutate(ticket.id),
				},
				disabled: disableSeeDelete
			    }}
			/>
		    )
		}
	    }),

	    columnHelper.accessor('fullNumber', {
		id: 'ticketNumber',
		header: 'Ticket Number',
		size: 160,
		cell: (info) => info.getValue() || '-'
	    }),

	    columnHelper.accessor((row) => row.asset ? `${row.asset.assetTag} ${row.asset.serialNumber}` : '', {
		id: "asset",
		header: 'Asset Tag / SN',
		cell: (info) => {
		    const asset = info.row.original.asset;
		    return (
			asset ? <div>
			    <div className="font-semibold">{asset.assetTag || '-'}</div>
			    <div className="text-xs text-gray-500">{asset.serialNumber || ''}</div>
			</div> : '-'
		    )
		},
	    }),

	    columnHelper.accessor((row) => row.asset?.category?.name, {
		id: "category",
		header: "Category",
		meta: {
		    filterVariant: 'multi-select',
		    filterOptions: categoryOptions,
		},
		cell: (info) => info.getValue() || "-"
	    }),

	    columnHelper.accessor('employee', {
		id: 'employee',
		header: 'User',
		size: 300,
		cell: (info) => {
		    const userNonEmployee = info.row.original.snapshot?.userNonEmployee;
		    const employee = info.row.original.employee;

		    if (!employee && !userNonEmployee) return <span>-</span>;
		    if (!employee && userNonEmployee) {
			return (
			    <div>
				<div className="font-semibold">{userNonEmployee}</div>
				<div className="text-xs text-gray-500">Non-Employee</div>
			    </div>
			);
		    }

		    return (
			<div>
			    <div className="font-semibold">
				{employee?.name} {userNonEmployee ? `(${userNonEmployee})` : ''}
			    </div>
			    <div className="text-xs text-gray-500">
				{`NIK: ${employee?.nik ? employee.nik : '-'}`}
			    </div>
			</div>
		    )
		}
	    }),

	    columnHelper.accessor((row) => row.location?.name, {
		id: 'locationId',
		header: 'Location',
		meta: {
		    filterVariant: 'multi-select',
		    filterOptions: locationOptions,
		},
		cell: (info) => info.getValue() || '-'
	    }),

	    columnHelper.accessor('problem', {
		id: 'problem',
		header: 'Problem',
		size: 400,
		cell: (info) => info.getValue() || '-'
	    }),

	    columnHelper.accessor('solution', {
		id: 'solution',
		header: 'Solution',
		size: 400,
		cell: (info) => info.getValue() || '-'
	    }),

	    columnHelper.accessor('contact', {
		id: 'contact',
		header: 'Contact',
		size: 200,
		cell: (info) => info.getValue() || '-'
	    }),

	    columnHelper.accessor('startAt', {
		id: 'startAt',
		header: 'Start At',
		meta: {
		    filterVariant: 'date',
		},
		cell: (info) => {
		    const rawValue = info.getValue();
		    if (!rawValue) return '-';
		    const rawDate = new Date(rawValue);
		    return rawDate.toLocaleTimeString('en-UK', {
			day: 'numeric',
			month: '2-digit',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
			timeZone: 'Asia/Jakarta'
		    });
		}
	    }),

	    columnHelper.accessor('solvedAt', {
		id: 'solvedAt',
		header: 'Solved At',
		meta: {
		    filterVariant: 'date',
		},
		cell: (info) => {
		    const rawValue = info.getValue();
		    if (!rawValue) return '-';
		    const rawDate = new Date(rawValue);
		    return rawDate.toLocaleTimeString('en-UK', {
			day: 'numeric',
			month: '2-digit',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
			timeZone: 'Asia/Jakarta'
		    });
		}
	    }),

	    columnHelper.accessor(row => row.engineer?.fullName, {
		id: "engineerName",
		header: 'Engineer',
		cell: (info) => info.getValue() || '-'
	    }),

	    columnHelper.accessor(row => row.createdBy?.fullName, {
		id: "createdByName",
		header: 'Created By',
		cell: (info) => info.getValue() || '-'
	    }),

	    columnHelper.accessor(row => row.approvedBy?.fullName, {
		id: "approvedByName",
		header: 'Approved By',
		cell: (info) => info.getValue() || '-'
	    }),
	],
	[locationOptions, categoryOptions, user, isAuthLoading]
    );

    const {
	columnFilters,
	setColumnFilters,
	pagination,
	setPagination,
	tableData,
	pageCount
    } = useServerTable({
	queryKey: 'tickets',
	fetcher: (params) => TicketRepository.getAll(params),
    });

    return (
	<>
	    <GeneratePdfDialog
		key={selectedTicket.id}
		open={openGeneratePdfDialog}
		onOpenChange={setOpenGeneratePdfDialog}
		data={selectedTicket}
	    />
	    <CloseTicketDialog
		open={openDialog}
		setOpen={setOpenDialog}
		ticket={selectedTicket}
	    />

	    <DialogContainer open={openUploadPdfDialog} setOpen={setOpenUploadPdfDialog} title={"Upload PDF"}
			     description={"Upload your BAST PDF File"}>
		<UploadFile
		    label="Ticket PDF"
		    description="Select a PDF File to upload."
		    setFile={setFile}
		    fileRef={fileRef}
		    acceptedFileTypes=".pdf"
		/>
	    </DialogContainer>
	    <DataTable<ITicket>
		   data={tableData}
		   columns={columns}
		   name='All Tickets'
		   isLoading={isAuthLoading}
		   create={{
		       label: 'Create new ticket',
		       to: '/tickets/create'
		   }}
		   pageCount={pageCount}
		   columnFilters ={columnFilters}
		   onColumnFiltersChange={setColumnFilters}
		   isManual
		   pagination = {pagination}
		   onPaginationChange={setPagination}
	    />
	</>

    )

}
