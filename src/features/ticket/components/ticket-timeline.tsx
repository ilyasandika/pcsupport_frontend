import type {ITicketForAsset} from "../../../types/ticket.type.ts";
import {useNavigate} from "react-router";
import {fmtDate, getStatusBadgeStyle} from "../../../helper/helper.tsx";
import {TimelineWrap} from "../../../components/timeline-wrap.tsx";

const statusStyles = {
    open: {
	badge: "bg-red-50 text-red-700 border-red-200",
	dot: "border-red-500 bg-red-50",
	label: "Terbuka",
    },
    "in progress": {
	badge: "bg-amber-50 text-amber-700 border-amber-200",
	dot: "border-amber-500 bg-amber-50",
	label: "Dalam Pengerjaan",
    },
    solved: {
	badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
	dot: "border-emerald-500 bg-emerald-50",
	label: "Selesai",
    },
};

export const TicketTimeline = ({tickets } : {tickets: ITicketForAsset[] | undefined}) => {
    const navigate = useNavigate();
    return (
	tickets ?
	    <TimelineWrap>
		{tickets.map((t) => {
		    return (
			<div key={t.id} className="relative">
			    <span className={`absolute -left-6 top-1 h-3 w-3 rounded-full border-2 ${statusStyles.solved.dot}`} />
			    <div className="flex flex-wrap items-baseline justify-between gap-2">
				<div>
				    <p className="font-semibold text-ptba-text cursor-pointer hover:text-ptba-primary" onClick={()=> {navigate(`/tickets/${t.id}`)}}>{t.fullNumber ? `Ticket No. ${t.fullNumber}` : `New Ticket`}</p>
				</div>
				<p className="whitespace-nowrap  text-xs text-slate-400">{fmtDate(t.createdAt)}</p>
			    </div>

			    <div className="mt-2 rounded-lg border border-slate-100 bg-slate-50 p-3.5">
				<div className="mb-2 flex flex-wrap items-center gap-2">
				<span className={`rounded-full border px-2.5 py-0.5  text-[11px] font-semibold uppercase tracking-wider ${getStatusBadgeStyle(t.status)}`}>
				    {t.status}
				</span>
				    <span className="rounded-md border border-slate-200 bg-white px-2 py-0.5  text-[11px] text-slate-500">
				    Engineer: {t.engineer?.fullName ?? "No Engineer"}
				</span>
				</div>
				<p className="text-sm leading-relaxed text-slate-600">{t.problem}</p>
			    </div>
			</div>
		    );
		})}
	    </TimelineWrap>
	    :
	    <div className="relative space-y-6 pl-6">No ticket yet</div>
    );
}