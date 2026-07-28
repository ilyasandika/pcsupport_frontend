import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import {ArrowRight, User} from "lucide-react";
import type {ITicket} from "@/types/ticket.type.ts";
import {cn} from "@/lib/utils.ts";
import {
    calculateSlaMetric, getProgressStyle,
    getStatusBadgeStyle, type TimeHMS,
} from "@/helper/helper.tsx";
import {Table, TableHeader, TableRow, TableBody, TableHead, TableCell} from "@/components/ui/table";
import {type ColumnDef, createColumnHelper, flexRender, getCoreRowModel, useReactTable} from "@tanstack/react-table";
import {useMemo} from "react";
import {type Table as TanStackTable} from "@tanstack/react-table";
import { Progress } from "@/components/ui/progress";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Link} from "react-router";


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

export const  LatestTicketCard = ({data, className}: LatestTicketCardProps) => {
    const columnHelper = createColumnHelper<ITicket>();
    const columns: ColumnDef<ITicket, any>[] = useMemo(
	() => [
	    columnHelper.accessor('problem', {
		header: 'Ticket',
		cell: (info) => {
		    const ticket = info.row.original
		    return (
			<Link className="flex flex-col" to={`/tickets/${ticket.id}`}>
			    <span className="text-sm text-ptba-gray">#{ticket.fullNumber}</span>
			    <span className={"font-bold"}>{ticket.problem}</span>
			    <span className="text-xs text-ptba-gray">Created By {ticket.createdBy.fullName}</span>
			</Link>
		    )
		}
	    }),

	    columnHelper.accessor("status", {
		header: 'status',
		cell: (info) => {
		    const status = info.row.original.status
		    return (
			<span className={cn("capitalize p-2 rounded-lg font-bold text-xs", getStatusBadgeStyle(status))}>{status}</span>
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
				<Avatar>
				    <AvatarImage alt="avatar"/>
				    <AvatarFallback>
					<User className="w-4"/>
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
			<div className="flex items-center gap-4">
			    <div className="">
				<span className={cn("capitalize p-2 rounded-lg font-bold text-xs", priorityStyles[ticket.slaPolicy.priority])}>{ticket.slaPolicy.priority}</span>
			    </div>
			    <div className="space-x-2 space-y-1 w-full">
			   	 <Progress value={progressValue.percentage} className={cn("w-[70%]", getProgressStyle(progressValue.percentage))}/>
				<span className={progressValue.percentage > 100 ? "text-xs text-ptba-primary-red animate-pulse" : "text-xs text-ptba-gray"}>{hoursLeft > 0 ? hoursLeft : 0}h {minutesLeft > 0 ? minutesLeft : 0}m remaining for {ticket.startAt ? "resolution" : "response"}</span>
			    </div>

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
	<Card className={cn("w-full border-slate-200 shadow-sm gap-0", className)}>
	    <CardHeader className="flex flex-row items-center justify-between border-b mb-0">
		<CardTitle>
		    Latest Ticket
		</CardTitle>
		<button className="flex items-center gap-1 text-sm font-medium text-teal-600 hover:text-teal-700">
		    See more
		    <ArrowRight className="h-3.5 w-3.5" />
		</button>
	    </CardHeader>
	    <CardContent className="p-0">
		<TicketDataTable table={table}/>
	    </CardContent>
	</Card>
    );
}


const TicketDataTable = ({table}: {
    table: TanStackTable<ITicket>;
}) => {
    return (
	<Table>
	    <TableHeader>
		{table.getHeaderGroups().map((headerGroup) => (
		    <TableRow key={headerGroup.id}>
			{headerGroup.headers.map((header) => {
			    return (
				<TableHead key={header.id} className="px-4 uppercase text-xs font-bold font-stretch-condensed text-ptba-gray">
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
				<TableCell key={cell.id} className="px-4">
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
    )
}