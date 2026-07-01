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
import {type ITicket} from "../../types/ticket.type.ts";
import {useNavigate} from "react-router";
import {getStatusBadgeStyle} from "../../helper/helper.tsx";

interface TicketTableProps {
    data: ITicket[]
    isLoading?: boolean
}

export const TicketTable = ({data, isLoading=false}: TicketTableProps ) =>  {
    const columnHelper = createColumnHelper<ITicket>();
    const navigate = useNavigate()
    const columns: ColumnDef<ITicket, any>[] = useMemo(
	() => [
	    columnHelper.accessor('status', {
		header: 'Status',
		size: 150,
		cell: (info) => {
		    const value = info.getValue()
		    const currentStyle = getStatusBadgeStyle(value) || 'bg-gray-100 text-gray-800 border-gray-200'
		    return (
			<div className="flex items-center">
			    <span className={`inline-flex items-center px-2.5 py-2 border rounded-lg text-xs font-medium  capitalize ${currentStyle}`}>
			      {value}
			    </span>
			</div>
		    )
		}
	    }),
	    columnHelper.accessor('fullNumber', {
		header: 'Ticket Number',
		size: 160,
	    }),
	    columnHelper.accessor(row => row.asset?.category.name, {
		header: 'Category',
		size: 120,
		cell: (info) => {
		    const value = info.getValue()
		    return (
			<div className={value ? 'uppercase' : ''}>
			    {value ? value : 'Non Asset'}
			</div>
		    )
		}
	    }),
	    columnHelper.accessor(row => {
		if (!row?.asset) return '';
		 return `${row.asset.assetTag} ${row.asset.serialNumber}`;
	    }, {
		header: 'Asset Tag / SN',
		cell: (info) => {
		    const asset = info.row.original.asset;
		    return (
			asset ? <div>
			    <div className="font-semibold">{asset?.assetTag}</div>
			    <div className="text-xs text-gray-500">{asset?.serialNumber}</div>
			</div>: '-'
		    )
		}
	    }),
	    columnHelper.accessor(row => {
		if (!row?.employee) return '';
		const status = row.asset?.assetAssignment?.userNonEmployeeName ? row.asset.assetAssignment.userNonEmployeeName : 'PIC';
		return `${row.employee.name} ${status} ${row.employee.nik}`;
	    }, {
		id: 'user',
		header: 'User',
		size: 300,
		cell: (info) => {
		    const user = info.row.original.asset?.assetAssignment;
		    const employee = info.row.original.employee;

		    if (!employee) return <span> - </span>
		    return (
			<div>
			    <div className="font-semibold">{`${employee?.name} (${user?.userNonEmployeeName ? user?.userNonEmployeeName : 'PIC'})`}</div>
			    <div className="text-xs text-gray-500">{`NIK: ${employee?.nik ? employee.nik : '-'}`}</div>
			</div>
		    )
		}
	    }),
	    columnHelper.accessor( (row) => row.location?.name, {
		header: 'Location'
	    }),
	    columnHelper.accessor((row) => row.slaPolicy.name, {
		header: 'SLA Policy',
	    }),


	    columnHelper.accessor('problem', {
		header: 'Problem',
		size: 400
	    }),

	    columnHelper.accessor(row => row.createdBy?.fullName, {
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

	    columnHelper.accessor(row => row.engineer?.fullName, {
		header: 'Engineer'
	    }),



	    columnHelper.accessor('solution', {
		header: 'Solution',
		size: 400,
	    }),

	    columnHelper.display({
		id: 'actions',
		header: 'actions',
		cell: (info) => {
		    const row = info.row.original;
		    return (
		       <ActionButtons
			   detail={{ onClick: (()=> navigate(`${row.id}`)) }}
			   edit={{onClick: (()=> console.log('edit'))}}
			   document={{onClick: (()=> console.log('document'))}}
			   remove={{onClick: (()=> console.log('remove'))}}
		       />
		   )
		}


	    }),
	],
	[]
    );

    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });

    const table = useReactTable<ITicket>({
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


    return (<Table table={table} name='All Tickets' isLoading={isLoading} />)

}