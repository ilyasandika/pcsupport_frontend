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
import type {ITicket} from "../../types/ticket.type.ts";
import {TicketRepository} from "../../data/repositories/ticket.repository.tsx";

export const TicketTable = () =>  {
    const [tickets, setTickets] = useState<ITicket[]>([]);

    useEffect(()=> {
	const loadTicket = async () => {
	    await TicketRepository.getAllTickets()
		.then((data) => setTickets(data))
	}

	loadTicket();
    }, [])

    const columnHelper = createColumnHelper<ITicket>();
    const columns: ColumnDef<ITicket, any>[] = useMemo(
	() => [
	    columnHelper.accessor('fullNumber', {
		header: 'Ticket Number',
		size: 160,
	    }),
	    columnHelper.accessor(row => row.asset?.assetTag, {
		id: 'assetTag',
		header: 'Asset Tag',
	    }),
	    columnHelper.accessor(row => {
		if (!row.user) return '';
		const status = row.user.userNonEmployee ? row.user.userNonEmployee : 'PIC';
		return `${row.user.name} ${status}`;
	    }, {
		id: 'user',
		header: 'User',
		size: 300,
		cell: (info) => {
		    const user = info.row.original.user
		    if (!user) return <span> - </span>
		    return (
			<div>
			    <div className="font-semibold">{`${user.name} (${user.userNonEmployee ? user.userNonEmployee : 'PIC'})`}</div>
			    <div className="text-xs text-gray-500">{`NIK: ${user.nik ? user.nik : '-'}`}</div>
			</div>
		    )
		}
	    }),
	    columnHelper.accessor( (row) => row.location.name, {
		header: 'Location'
	    }),
	    columnHelper.accessor(row => row.asset?.category, {
		id: 'category',
		header: 'Category',
		size: 120
	    }),

	    columnHelper.accessor('problem', {
		header: 'Problem',
		size: 400
	    }),

	    columnHelper.accessor(row => row.createdBy?.username, {
		header: 'Created By'
	    }),

	    columnHelper.accessor( 'startAt', {
		header: 'Start At',
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

	    columnHelper.accessor( 'solvedAt', {
		header: 'Solved At',
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

	    columnHelper.accessor(row => row.engineer?.username, {
		header: 'Engineer'
	    }),

	    columnHelper.accessor('status', {
		header: 'Status',
		size: 150,
	    }),

	    columnHelper.accessor('solution', {
		header: 'Solution',
		size: 400,
	    }),

	    // Contoh display column untuk tombol aksi (tidak ng-link ke data)
	    columnHelper.display({
		id: 'actions',
		header: 'actions',
		cell: () => (
		   <ActionButtons
		       edit={{onClick: (()=> console.log('edit'))}}
		       document={{onClick: (()=> console.log('document'))}}
		       remove={{onClick: (()=> console.log('remove'))}}
		   />
		),
	    }),
	],
	[]
    );

    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });

    const table = useReactTable<ITicket>({
	data : tickets,
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

// E. Render Halaman
    return (<Table table={table} name='All Tickets' />)

}