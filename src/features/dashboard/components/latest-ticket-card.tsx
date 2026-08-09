
import {User} from "lucide-react";
import type {ITicket} from "@/types/ticket.type.ts";
import {cn} from "@/lib/utils.ts";
import { getProgressStyle, getStatusBadgeStyle } from "@/helper/style-helper.tsx";
import {
    calculateSlaMetric,
    type TimeHMS,
} from "@/helper/helper.tsx";
import {Table, TableHeader, TableRow, TableBody, TableHead, TableCell} from "@/components/ui/table";
import {type ColumnDef, createColumnHelper, flexRender, getCoreRowModel, useReactTable} from "@tanstack/react-table";
import {useMemo} from "react";
import {type Table as TanStackTable} from "@tanstack/react-table";
import { Progress } from "@/components/ui/progress";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Link} from "react-router";
import { Badge } from "@/components/ui/badge";


const priorityStyles = {
    high: "bg-red-50 text-red-600 border-red-200",
    medium: "bg-amber-50 text-amber-700 border-amber-200",
    normal: "bg-amber-50 text-amber-700 border-amber-200",
    low: "bg-blue-50 text-blue-600 border-blue-200",
};

interface LatestTicketCardProps {
    data: ITicket[];
    className?: string;
}

export const LatestTicketCard = ({data}: LatestTicketCardProps) => {
    const columnHelper = createColumnHelper<ITicket>();
    const columns: ColumnDef<ITicket, any>[] = useMemo(
	() => [
	    columnHelper.accessor('problem', {
		header: 'Ticket',
		size: 200,
		cell: (info) => {
		    const ticket = info.row.original
		    return (
			<Link className="flex flex-col" to={`/tickets/${ticket.id}`}>
			    <span className="text-sm text-ptba-gray">#{ticket.fullNumber}</span>
			    <span className={"font-medium text-sm truncate"}>{ticket.problem}</span>
			    <span className="text-xs text-ptba-gray">Created By {ticket.createdBy.fullName}</span>
			</Link>
		    )
		}
	    }),

	    columnHelper.accessor("status", {
		header: 'status',
		size: 100,
		cell: (info) => {
		    const status = info.row.original.status
		    return (
			<Badge className={cn("capitalize text-xs", getStatusBadgeStyle(status))}>{status}</Badge>
		    )
		}
	    }),

	    columnHelper.accessor('engineer', {
		header: 'Assigned To',
		cell: (info) => {
		    const engineer = info.row.original.engineer
		    return (
			engineer?.fullName ?
			    <div className="flex items-center gap-2">
				<Avatar size={"sm"}>
				    <AvatarImage alt="avatar"/>
				    <AvatarFallback>
					<User className="w-3"/>
				    </AvatarFallback>
				</Avatar>
				{engineer.fullName}
			    </div>
			    :
			    "-"
		    )
		}
	    }),

	    columnHelper.accessor('slaPolicy', {
		header: 'SLA Policy',
		size: 75,
		cell: (info) => {

		    const ticket = info.row.original

		    return (
			<div className="">
			    <span className={cn("capitalize p-2 rounded-lg font-bold text-xs", priorityStyles[ticket.slaPolicy.priority])}>{ticket.slaPolicy.priority}</span>
			</div>
		    )
		}
	    }),
	    columnHelper.accessor('slaPolicy', {
		header: 'SLA Policy',
		size: 200,
		cell: (info) => {

		    const ticket = info.row.original

		    const responseMetric = calculateSlaMetric(
			ticket.createdAt,
			ticket.startAt || new Date().toISOString(),
			ticket.slaPolicy.responseTimeSeconds
		    );

		    let resolutionMetric: {actual: TimeHMS, target: TimeHMS, percentage: number} | undefined;
		    if (ticket.startAt) {
			 resolutionMetric = calculateSlaMetric(
			    ticket.startAt,
			    ticket.solvedAt || new Date().toISOString(),
			    ticket.slaPolicy.resolutionTimeSeconds
			);
		    }

		    const progressValue = resolutionMetric ? resolutionMetric : responseMetric;
		    const hoursLeft = progressValue.target.hours - progressValue.actual.hours;
		    const minutesLeft = progressValue.target.minutes - progressValue.actual.minutes
		    return (

			    <div className="space-x-2 space-y-1 w-full">
			   	 <Progress value={progressValue.percentage} className={cn("w-[70%] h-1.5", getProgressStyle(progressValue.percentage))}/>
				<span className={progressValue.percentage > 75 ? "text-xs text-ptba-primary-red animate-pulse" : "text-xs text-ptba-gray"}>{hoursLeft > 0 ? hoursLeft : 0}h {minutesLeft > 0 ? minutesLeft : 0}m remaining for {ticket.startAt ? "resolution" : "response"}</span>
			    </div>



		    )
		}
	    }),
	],
	[]
    );

    const table = useReactTable<ITicket>({
	data: data,
	columns,
	getCoreRowModel: getCoreRowModel(),
    });

    return (

		<TicketDataTable table={table}/>

    );
}


const TicketDataTable = ({table}: {
    table: TanStackTable<ITicket>;
}) => {
    return (
	<div className="overflow-x-auto">
	    <Table className="table-fixed min-w-full">
		<TableHeader>
		    {table.getHeaderGroups().map((headerGroup) => (
			<TableRow key={headerGroup.id}>
			    {headerGroup.headers.map((header) => {
				return (
				    <TableHead key={header.id} className="px-4 uppercase text-xs font-bold font-stretch-condensed text-ptba-gray"
					       style={{ width: `${header.getSize()}px` }}
				    >
					{header.isPlaceholder
					    ? null
					    : flexRender(
						header.column.columnDef.header,
						header.getContext()
					    )}
				    </TableHead>
				)
			    })}
			</TableRow>
		    ))}
		</TableHeader>
		<TableBody>
		    {table.getRowModel().rows?.length ? (
			table.getRowModel().rows.map((row) => (
			    <TableRow
				key={row.id}
				data-state={row.getIsSelected() && "selected"}
			    >
				{row.getVisibleCells().map((cell) => (
				    <TableCell key={cell.id} className="px-4"
					       style={{ width: `${cell.column.getSize()}px` }}
				    >
					{flexRender(cell.column.columnDef.cell, cell.getContext())}
				    </TableCell>
				))}
			    </TableRow>
			))
		    ) : (
			<TableRow>
			    <TableCell className="h-24 text-center">
				No results.
			    </TableCell>
			</TableRow>
		    )}
		</TableBody>
	    </Table>
	</div>
    )
}