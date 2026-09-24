import type {ITicketForAsset} from "../../../types/ticket.type.ts";
import {Link, useNavigate} from "react-router";
import { fmtDate } from "../../../helper/helper.tsx";
import { getStatusBadgeStyle } from "@/helper/style-helper.tsx";
import {TimelineWrap} from "../../../components/timeline-wrap.tsx";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Badge} from "@/components/ui/badge";
import {useState} from "react";
import {InputGroup, InputGroupAddon, InputGroupInput} from "@/components/ui/input-group";
import {Search} from "lucide-react";

const statusDotStyles: Record<string, string> = {
    open: "border-red-500 bg-red-50",
    "in progress": "border-amber-500 bg-amber-50",
    solved: "border-emerald-500 bg-emerald-50",
};

interface TicketTimelineProps {
    tickets: ITicketForAsset[] | undefined;
    /** Max height of the scroll area before it starts scrolling instead of growing forever */
    maxHeight?: string;
}

export const TicketTimeline = ({tickets, maxHeight = "420px"}: TicketTimelineProps) => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");

    const filteredTickets = tickets?.filter((ticket) => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
            ticket.fullNumber?.toLowerCase().includes(query) ||
            ticket.problem?.toLowerCase().includes(query) ||
            ticket.status?.toLowerCase().includes(query) ||
            ticket.engineer?.fullName?.toLowerCase().includes(query)
        );
    });

    if (!tickets || tickets.length === 0) {
	return <div className="relative space-y-6 pl-6 text-sm text-slate-400">No ticket yet</div>;
    }

    return (
	<div className="flex flex-col gap-3">
	    <InputGroup className="mb-4">
		<InputGroupInput
		    placeholder="Search by ticket number, problem, status, engineer..."
		    value={searchQuery}
		    onChange={(e) => setSearchQuery(e.target.value)}
		/>
		<InputGroupAddon>
		    <Search/>
		</InputGroupAddon>
	    </InputGroup>

	    <ScrollArea style={{height: maxHeight}} className="pr-4">
		<TimelineWrap>
		    {filteredTickets && filteredTickets.length > 0 ? (
			filteredTickets.map((t) => {
		    const dotStyle = statusDotStyles[t.status] ?? statusDotStyles.open;
		    return (
			<div key={t.id} className="relative">
			    <span className={`absolute -left-6 top-1 h-3 w-3 rounded-full border-2 ${dotStyle}`}/>
			    <div className="flex flex-wrap items-baseline justify-between gap-2">
				<div>
				    <p
					className="font-semibold text-ptba-text cursor-pointer hover:text-ptba-primary"
					onClick={() => navigate(`/tickets/${t.id}`)}
				    >
					{t.fullNumber ? `Ticket No. ${t.fullNumber}` : `New Ticket`}
				    </p>
				</div>
				<p className="whitespace-nowrap text-xs text-slate-400">{fmtDate(t.startAt)} - {fmtDate(t.solvedAt)} </p>
			    </div>

			    <div className="mt-2 rounded-lg border border-slate-100 bg-slate-50 p-3.5">
				<div className="mb-2 flex flex-wrap items-center gap-2">
				    <Badge
					variant="outline"
					className={`rounded-full text-[11px] font-semibold uppercase tracking-wider ${getStatusBadgeStyle(t.status)}`}
				    >
					{t.status}
				    </Badge>
				    <Badge variant="outline" className="text-[11px] font-normal text-slate-500">
					Engineer: {t.engineer?.fullName ?? "No Engineer"}
				    </Badge>
				</div>
				<Link
				    to={`/tickets/${t.id}`}
				    className="text-sm leading-relaxed text-slate-600 cursor-pointer hover:underline"
				>
				    {t.problem}
				</Link>
			    </div>
			</div>
		    );
		})
		    ) : (
			<div className="relative space-y-6 pl-6 text-sm text-slate-400">No matching results</div>
		    )}
		</TimelineWrap>
	    </ScrollArea>
	</div>
    );
};