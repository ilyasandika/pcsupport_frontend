import {
	type ColumnDef,
	type ColumnFiltersState,
	createColumnHelper,
	getCoreRowModel,
	useReactTable
} from "@tanstack/react-table";
import {
	useEffect,
	useMemo,
	useRef,
	useState
} from "react";
import DataTable from "./data-table.tsx";
import { ActionButtons } from "./action-button.tsx";
import { type ITicket, TicketStatus } from "@/types/ticket.type.ts";
import { getStatusBadgeStyle } from "@/helper/style-helper.tsx";
import {
	columnFiltersToParams,
	isTicketCancelled,
	isTicketOpen,
	isTicketProgressGroup,
	isTicketSolved
} from "../../helper/helper.tsx";
import { TicketRepository } from "@/data/repositories/ticket.repository.ts";
import { WorkLocationRepository } from "@/data/repositories/work-location.repository.ts";
import { CloseTicketDialog } from "@/features/ticket/components/close-ticket-dialog.tsx";
import { useAuth } from "@/context/AuthContext.tsx";
import { useNotificationDialog } from "@/context/NotificationDialogContext.tsx";
import { UploadFile } from "@/components/upload-file.tsx";
import { GeneratePdfDialog } from "@/features/user/components/generate-pdf-dialog.tsx";
import { useDebouncedValue } from "@/hooks/use-debounced-value.tsx";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AlertDialogContainer } from "@/components/alert-dialog-container.tsx";
import type { IDetailWorkLocation } from "@/types/work-location.type.ts";
import { Badge } from "../ui/badge.tsx";

interface TicketTableProps {
	data?: ITicket[]
	locations?: IDetailWorkLocation[]
	isLoading?: boolean
}

export const TicketTable = ({ locations: initialLocations, isLoading = false }: TicketTableProps) => {

	const [selectedTicket, setSelectedTicket] = useState<ITicket>({} as ITicket);
	const { showNotification } = useNotificationDialog()
	const [openDialog, setOpenDialog] = useState<boolean>(false);
	const [openGeneratePdfDialog, setOpenGeneratePdfDialog] = useState<boolean>(false);
	const [openUploadPdfDialog, setOpenUploadPdfDialog] = useState<boolean>(false);

	const [_a, setFile] = useState<File | null>(null)
	const fileRef = useRef<File | null>(null);

	const { isEngineer, isAdmin, isHelpdesk, user } = useAuth()

	const deleteTicketMutation = useMutation({
		mutationFn: (id: number) => TicketRepository.hardRemoveTicket(id),
		onSuccess: () => {
			showNotification({
				variant: "success",
				title: "Ticket has been deleted",
				description: "Ticket has been deleted successfully",
				onClose: () => window.location.reload(),
			})
		},
		onError: () => {
			showNotification({
				variant: "error",
				title: "Failed to delete ticket",
				description: "Failed to delete ticket",
				onClose: () => window.location.reload(),
			})
		}
	})

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
	const { data: locations } = useQuery({
		queryKey: ['work-locations'],
		queryFn: () => WorkLocationRepository.getAll(),
		initialData: initialLocations,
	});

	const locationOptions = useMemo(() => {
		return (locations || initialLocations)?.map((loc) => ({ label: loc.name, value: loc.id })) || [];
	}, [locations, initialLocations]);

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
					const currentStyle = getStatusBadgeStyle(value) || ''
					return (
						<div className="flex flex-col gap-2 w-full">
							<Badge className={`${currentStyle} capitalize`} >
								{value}
							</Badge>
							{(!ticket.filePath && isTicketSolved(ticket.status)) && <Badge variant="destructive">Upload WO</Badge>}
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
					const disabledOnSolved = isTicketSolved(ticket.status);
					const disabledOnOpen = isTicketOpen(ticket.status);
					const disabledOnCancelled = isTicketCancelled(ticket.status);

					const enableEdit = () => {
						if (isTicketSolved(ticket.status)) {
							// return isAdmin();
							return true;
						}
						if (isTicketOpen(ticket.status)) {
							return isAdmin() || isHelpdesk();
						}
						if (isTicketProgressGroup(ticket.status)) {
							if (isAdmin() || isHelpdesk()) {
								return true;
							}
							if (isEngineer()) {
								return ticket?.engineer?.id === user?.sub;
							}

							return false;
						}
						return false;
					};
					return (
						<ActionButtons
							detail={{
								to: `${ticket.id}`,
								tooltip: 'Detail Ticket',
							}}
							edit={{
								to: `/tickets/${ticket.id}/update`,
								tooltip: 'Edit Ticket',
								disabled: !enableEdit()
							}}
							generateDocument={{
								onClick: () => {
									setSelectedTicket(ticket)
									setOpenGeneratePdfDialog(true)
								},
								tooltip: 'Generate Ticket',
								disabled: !disabledOnSolved
							}}
							remove={{
								tooltip: 'Remove Ticket',
								alert: {
									title: "Are you sure remove this ticket?",
									description: "this action cannot be undone",
									variant: "danger",
									onContinue: () => deleteTicketMutation.mutate(ticket.id),
								},
								disabled: !disabledOnOpen || isEngineer()
							}}
							check={{
								onClick: () => {
									setSelectedTicket(ticket)
									setOpenDialog(true)
								},
								tooltip: 'Close Ticket',
								disabled: disabledOnSolved || disabledOnOpen || disabledOnCancelled
							}}
							uploadDocument={{
								tooltip: 'Upload Ticket',
								alert: {
									title: "Upload Ticket",
									description: "Upload PDF Max: 1 MB",
									content: <UploadFile
										label="Ticket PDF"
										description="Select a PDF File to upload."
										setFile={setFile}
										fileRef={fileRef}
										acceptedFileTypes=".pdf"
									/>,
									onContinue: () => uploadTicket(ticket.id, fileRef.current)
								},
								disabled: !disabledOnSolved
							}}
							seeDocument={{
								onClick: () => {
									TicketRepository.getSolvedTicketPdf(ticket.id)
								},
								tooltip: 'See Ticket',
								disabled: !ticket.filePath || !disabledOnSolved
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

			columnHelper.accessor((row) => row.employee ? `${row.employee.name} ${row.employee.nik}` : (row.userNonEmployeeSnapshot || ''), {
				id: 'employee',
				header: 'User',
				size: 300,
				cell: (info) => {
					const userNonEmployee = info.row.original.snapshot?.userNonEmployee || info.row.original.userNonEmployeeSnapshot;
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
		],
		[locationOptions]
	);

	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
	const debouncedFilters = useDebouncedValue(columnFilters, 400);

	const [columnSizing, setColumnSizing] = useState(() => {
		const savedSizes = localStorage.getItem('table-column-sizes');
		return savedSizes ? JSON.parse(savedSizes) : {};
	});

	useEffect(() => {
		localStorage.setItem('table-column-sizes', JSON.stringify(columnSizing));
	}, [columnSizing]);

	const { data } = useQuery({
		queryKey: ['tickets', pagination, debouncedFilters],
		queryFn: async () =>
			await TicketRepository.getAll({
				page: pagination.pageIndex + 1,
				limit: pagination.pageSize,
				...columnFiltersToParams(debouncedFilters),
			}),
		placeholderData: (prev) => prev,
	});

	const table = useReactTable<ITicket>({
		data: data?.data ?? [],
		columns,
		state: {
			columnFilters,
			pagination,
			columnSizing
		},
		pageCount: data?.meta?.totalPages ?? -1,
		renderFallbackValue: '-',
		onColumnFiltersChange: setColumnFilters,
		onPaginationChange: setPagination,
		getCoreRowModel: getCoreRowModel(),
		columnResizeMode: 'onChange',
		onColumnSizingChange: setColumnSizing,
		manualPagination: true,
		manualFiltering: true,
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

			<AlertDialogContainer open={openUploadPdfDialog} setOpen={setOpenUploadPdfDialog} title={"Upload PDF"} description={"Upload your BAST PDF File"}>
				<UploadFile
					label="Ticket PDF"
					description="Select a PDF File to upload."
					setFile={setFile}
					fileRef={fileRef}
					acceptedFileTypes=".pdf"
				/>
			</AlertDialogContainer>
			<DataTable table={table}
				name='All Tickets'
				isLoading={isLoading}
				create={{
					label: 'Create new ticket',
					to: '/tickets/create'
				}}
			/>
		</>

	)

}
