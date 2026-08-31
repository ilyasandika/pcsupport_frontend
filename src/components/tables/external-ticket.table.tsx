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
import { useMutation } from "@tanstack/react-query";
import type { IExternalTicket } from "@/types/external-ticket.type.ts";
import dayjs from 'dayjs';
import DataTable from "@/components/tables/data-table.tsx";
import { ActionButtons } from "@/components/tables/action-button.tsx";
import { ExternalTicketRepository } from "@/data/repositories/external-ticket.repository.ts";
import { useNotificationDialog } from "@/context/NotificationDialogContext.tsx";
import { Badge } from "@/components/ui/badge.tsx";

interface ExternalTicketTableProps {
    data: IExternalTicket[];
    isLoading?: boolean;
}

export const ExternalTicketTable = ({ data = [], isLoading = false }: ExternalTicketTableProps) => {
    const { showNotification } = useNotificationDialog();
    const columnHelper = createColumnHelper<IExternalTicket>();

    const deleteMutation = useMutation({
        mutationFn: (id: number) => ExternalTicketRepository.remove(id),
        onSuccess: () => {
            showNotification({
                variant: "success",
                title: "External Ticket Deleted",
                description: "External ticket has been removed successfully.",
                onClose: () => window.location.reload(),
            });
        },
        onError: () => {
            showNotification({
                variant: "error",
                title: "Action Failed",
                description: "Failed to delete external ticket. Please try again.",
            });
        },
    });

    const columns: ColumnDef<IExternalTicket, any>[] = useMemo(
	() => [
            columnHelper.accessor("status", {
                id: "status",
                header: "Status",
                cell: (info) => {
                    const statusVal = String(info.getValue() || "").toLowerCase();
                    let badgeClass = "bg-blue-100 text-blue-800 border-blue-200";
                    if (statusVal === "closed" || statusVal === "resolved") {
                        badgeClass = "bg-green-100 text-green-800 border-green-200";
                    } else if (statusVal === "cancelled") {
                        badgeClass = "bg-red-100 text-red-800 border-red-200";
                    }
                    return (
                        <Badge variant="outline" className={`capitalize font-semibold ${badgeClass}`}>
                            {info.getValue() || "In Progress"}
                        </Badge>
                    );
                },
            }),
            columnHelper.display({
                id: "actions",
                header: "Actions",
                cell: (info) => {
                    const item = info.row.original;
                    return (
                        <ActionButtons
                            edit={{
                                to: `/external-tickets/${item.id}/update`,
                                tooltip: "Edit External Ticket",
                            }}
                            remove={{
                                tooltip: "Delete External Ticket",
                                alert: {
                                    title: "Delete External Ticket?",
                                    description: `Are you sure you want to delete case #${item.caseNumber || item.id}? This action cannot be undone.`,
                                    variant: "danger",
                                    onContinue: () => deleteMutation.mutate(item.id),
                                },
                            }}
                        />
                    );
                },
            }),
	    columnHelper.accessor("ticketFullNumber", {
		id: "ticketFullNumber",
		header: "No. Tiket Full",
		cell: (info) => info.getValue() ?? "-",
	    }),
	    columnHelper.accessor((row) => row.ticket?.fullNumber, {
		id: "internalTicketNumber",
		header: "No. Tiket Internal",
		cell: (info) => info.getValue() ?? "-",
	    }),
	    columnHelper.accessor((row) => row.vendor?.name, {
		id: "vendorName",
		header: "Vendor",
		cell: (info) => info.getValue() ?? "-",
	    }),
	    columnHelper.accessor("caseNumber", {
		id: "caseNumber",
		header: "Case Number / SR No.",
		cell: (info) => info.getValue() ?? "-",
	    }),
	    columnHelper.accessor("problem", {
		id: "problem",
		header: "Problem",
		cell: (info) => info.getValue() ?? "-",
	    }),
	    columnHelper.accessor("resolution", {
		id: "resolution",
		header: "Resolusi",
		cell: (info) => info.getValue() ?? "-",
	    }),
	    columnHelper.accessor("escalatedDate", {
		id: "escalatedDate",
		header: "Tgl Eskalasi",
		cell: (info) => {
		    const value = info.getValue();
		    return value ? dayjs(value).format("DD MMM YYYY") : "-";
		},
	    }),
	    columnHelper.accessor("resolvedDate", {
		id: "resolvedDate",
		header: "Tgl Selesai",
		cell: (info) => {
		    const value = info.getValue();
		    return value ? dayjs(value).format("DD MMM YYYY") : "-";
		},
	    }),
	    columnHelper.accessor("createdAt", {
		id: "createdAt",
		header: "Dibuat",
		cell: (info) => dayjs(info.getValue()).format("DD MMM YYYY HH:mm"),
	    }),
	],
	[]
    );

    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

    const table = useReactTable<IExternalTicket>({
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

    return (
	<DataTable
            table={table}
            name='All External Tickets'
            isLoading={isLoading}
            create={{
                label: 'Create new External Ticket',
                to: '/external-tickets/create'
            }}
	/>
    );
};