import {
    type ColumnDef,
    type ColumnFiltersState,
    createColumnHelper,
    getCoreRowModel, getFilteredRowModel, getPaginationRowModel,
    useReactTable
} from "@tanstack/react-table";
import {useMemo, useState} from "react";
import type {IExternalTicket} from "@/types/external-ticket.type.ts";
import dayjs from 'dayjs';
import DataTable from "@/components/tables/data-table.tsx";


interface ExternalTicketTableProps {
    data: IExternalTicket[]
    isLoading?: boolean
}

export const ExternalTicketTable = ({data}: ExternalTicketTableProps) => {
    const columnHelper = createColumnHelper<IExternalTicket>();

    const columns: ColumnDef<IExternalTicket, any>[] = useMemo(
	() => [
	    columnHelper.accessor("ticketFullNumber", {
		id: "ticketFullNumber",
		header: "No. Tiket",
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
		header: "No. Case",
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
	    columnHelper.accessor("updatedAt", {
		id: "updatedAt",
		header: "Diperbarui",
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
	<DataTable table={table}
		   name='All External Tickets'
		   create={{
		       label: 'Create new External Ticket',
		       to: '/external-tickets/create'
		   }}
	/>
    )
}