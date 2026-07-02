import {useState, type ReactNode, type MouseEventHandler} from "react";
import {
    Laptop,
    Barcode,
    ShieldCheck,
    Cable,
    Briefcase,
    User,
    Wrench,
    AlertTriangle,
    LaptopIcon, Clock, type LucideIcon,
} from "lucide-react";
import {Card} from "../../../components/card.tsx";
import {CardRow} from "../../../components/tables/card-row.tsx";
import {useLoaderData, useNavigate} from "react-router";
import type {IAssetAssignment, IDetailAsset} from "../../../types/asset.type.ts";
import {byteToStringMb, getStatusBadgeStyle} from "../../../helper/helper.tsx";
import type {ITicketForAsset} from "../../../types/ticket.type.ts";
import {BackButton} from "../../../components/back-button.tsx";

// ---------- helpers ----------
const fmtDate = (d: string) =>
    d
	? new Date(d).toLocaleDateString("id-ID", {
	    day: "numeric",
	    month: "short",
	    year: "numeric",
	})
	: "—";

function monthsDaysBetween(startStr: string, endStr: string) {
    const start = new Date(startStr);
    const end = endStr ? new Date(endStr) : new Date();
    let months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    let days = end.getDate() - start.getDate();
    if (days < 0) {
	months -= 1;
	days += new Date(end.getFullYear(), end.getMonth(), 0).getDate();
    }
    if (months < 0) { months = 0; days = 0; }
    return { months, days };
}

// Badge style disamakan dengan getStatusBadgeStyle() pada TicketDetailPage:
// rounded-full border uppercase tracking-wider
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

export const AssetDetailPage = () => {
    const [tab, setTab] = useState("user");
    const asset = useLoaderData<IDetailAsset>()

    const openTickets = asset.tickets?.filter((t) => t.status == "open" || t.status == "in progress") || [];

    return (
	<div className="min-h-screen bg-slate-50 p-6 font-sans text-ptba-text">
	    <div className="max-w-7xl mx-auto space-y-6">
		<BackButton />

		{/* --- 1. HEADER SECTION --- */}
		<div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
		    <div className="flex flex-wrap items-center justify-between gap-4 p-6">
			<div className="flex gap-4 items-center">
			    <div className="hidden h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-ptba-primary text-white sm:flex">
				<Laptop size={32} />
			    </div>
			    <div>
				<p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
				    {asset.category.name}
				</p>
				<h1 className="mt-1 text-2xl font-bold tracking-tight">
				    {asset.brand} {asset.model}
				</h1>
				<p className="mt-1  text-sm text-slate-500">
				    SN {asset.serialNumber} · Host {asset.hostname}
				</p>
			    </div>
			</div>

			<div className="flex flex-col items-start gap-1 sm:items-end">
			    <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
				<Barcode size={13} /> Asset Tag
			    </span>
			    <span className=" text-2xl font-bold text-ptba-text">
				{asset.assetTag}
			    </span>
			</div>
		    </div>

		    {openTickets.length > 0 && (
			<div className="flex items-center gap-2 bg-red-50/60 border-t border-red-100 px-6 py-3 text-sm text-red-700">
			    <AlertTriangle size={16} className="shrink-0" />
			    <span>
				<strong className="font-semibold">{openTickets.length} tiket</strong>{" "}
				in progress — check ticket & maintenance histories for more details.
			    </span>
			</div>
		    )}
		</div>

		{/* --- 2. BODY GRID --- */}
		<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

		    {/* LEFT COLUMN: Specs (1/3) */}
		    <div className="space-y-6">
			<Card title="specification" Icon={LaptopIcon}>
			    <CardRow label="Processor" value={asset.processor || '-'} />
			    <CardRow label="RAM" value={asset.memoryCapacityByte ? byteToStringMb(asset.memoryCapacityByte) : '-'} />
			    <CardRow label="Storage" value={asset.storageCapacityByte ? byteToStringMb(asset.storageCapacityByte) : '-'}  />
			    <CardRow label="Location" value={asset.workLocation.name} last />
			</Card>

			<Card title="Warranty & Purchase" Icon={ShieldCheck}>
			    <CardRow label="Purchase Date" value={asset.purchaseDate ? fmtDate(asset.purchaseDate) : '-'} />
			    <CardRow label="Warranty Date" value={asset.warrantyDate ? fmtDate(asset.warrantyDate) : '-'} last />
			    {/*<div className="mt-3">*/}
				{/*<div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">*/}
				{/*    <div*/}
				{/*	className={`h-full rounded-full ${warranty.expired ? "bg-red-500" : "bg-emerald-500"}`}*/}
				{/*	style={{ width: `${warranty.pct}%` }}*/}
				{/*    />*/}
				{/*</div>*/}
				{/*<p className="mt-2  text-xs text-slate-500">{warranty.note}</p>*/}
			    {/*</div>*/}
			</Card>

			<Card title="Supports" Icon={Cable}>
			    <div className="flex flex-wrap gap-2">
				{asset.supports.map((s) => (
				    <span
					key={s.name}
					className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5  text-xs text-slate-600"
				    >
					{s.name}
				    </span>
				))}
			    </div>
			</Card>

			<Card title="Project" Icon={Briefcase}>
			    <p className="text-sm font-semibold text-ptba-text">{asset.project.name}</p>
			    <p className="mt-0.5 text-sm text-slate-500">{asset.project.vendor.name}</p>
			</Card>
		    </div>

		    {/* RIGHT COLUMN: Tabs + timelines (2/3) */}
		    <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs p-6">
			<div className="flex gap-6 border-b border-slate-100">
			    <TabButton
				active={tab === "user"}
				onClick={() => setTab("user")}
				Icon={User}
				label="User Histories"
				count={asset.assetAssignments?.length || 0}
			    />
			    <TabButton
				active={tab === "ticket"}
				onClick={() => setTab("ticket")}
				Icon={Wrench}
				label="Ticket & Maintenance Histories"
				count={asset.tickets?.length || 0}
			    />
			</div>

			<div className="pt-6">
			    {tab === "user" ? <UserTimeline assetAssignments={asset.assetAssignments} /> : <TicketTimeline tickets={asset.tickets} />}
			</div>
		    </div>
		</div>
	    </div>
	</div>
    );
}

// ---------- small building blocks ----------



interface ITabButtonProps  {
    active: boolean;
    onClick: MouseEventHandler<HTMLButtonElement>;
    Icon: LucideIcon;
    label: string;
    count: number;


}
const TabButton = ({ active, onClick, Icon, label, count }: ITabButtonProps) => {
    return (
	<button
	    onClick={onClick}
	    className={`relative flex items-center gap-2 pb-3 text-sm font-semibold transition-colors ${
		active ? "text-ptba-text" : "text-slate-400 hover:text-slate-600"
	    }`}
	>
	    <Icon size={15} />
	    {label}
	    <span
		className={`rounded-full px-2 py-0.5  text-[11px] ${
		    active ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-500"
		}`}
	    >
		{count}
	    </span>
	    {active && <span className="absolute -bottom-px left-0 right-0 h-0.5 bg-slate-900" />}
	</button>
    );
}

const TimelineWrap = ({ children }: {children: ReactNode}) => {
    return (
	<div className="relative space-y-6 pl-6">
	    <div className="absolute bottom-1 left-1.25 top-1 w-px bg-slate-200" />
	    {children}
	</div>
    );
}

function UserTimeline({assetAssignments} : {assetAssignments: IAssetAssignment[] | undefined}) {
    return (
	assetAssignments ?
	<TimelineWrap>
	    {assetAssignments.map((u) => {
		const isCurrent = !u.returnedAt;
		const { months, days } = monthsDaysBetween(u.assignedAt, u.returnedAt || new Date().toDateString())
		return (
		    <div key={u.employee.id} className="relative">
			<span
			    className={`absolute -left-6 top-1 h-3 w-3 rounded-full border-2 bg-white ${
				isCurrent ? "border-emerald-500" : "border-slate-300"
			    }`}
			/>
			<div className="flex items-baseline justify-between gap-2">
			    <div className="flex gap-1 flex-col">
				<div className="flex gap-2">
				    <span className="font-semibold text-ptba-text">{u.employee.name}</span>
				    <span className="rounded-md border border-slate-200 bg-white px-2 py-0.5  text-[11px] text-slate-500">
				    NIK {u.employee.nik}
				</span>
				</div>
				<p className="text-xs text-slate-500">
				    {u.employee.position}
				</p>
				<p className="text-xs text-slate-500">
				    {u.employee.department}
				</p>
			    </div>
			    <p className="whitespace-nowrap  text-xs text-slate-400">
				{fmtDate(u.assignedAt)} → {!u.returnedAt ? "now" : fmtDate(u.returnedAt)}
			    </p>
			</div>

			<div className={`mt-2 rounded-lg border p-3.5 ${
			    isCurrent ? "bg-emerald-50/40 border-emerald-100" : "bg-slate-50 border-slate-100"
			}`}>
			    <div className="mb-2 flex flex-wrap items-center gap-2">
				<span
				    className={`rounded-full border px-2.5 py-0.5  text-[11px] font-semibold uppercase tracking-wider ${
					isCurrent
					    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
					    : "bg-slate-100 text-slate-500 border-slate-200"
				    }`}
				>
				    {isCurrent ? "In Use" : "Returned"}
				</span>
				{u.userNonEmployeeName && (
				    <span className="rounded-md border border-slate-200 bg-white px-2 py-0.5  text-[11px] text-slate-500">
					User: {u.userNonEmployeeName}
				    </span>
				)}
			    </div>
			    <p className="text-sm leading-relaxed text-slate-600">{u.remarks || '-'}</p>
			    <p className="mt-2 flex items-center gap-1  text-[11px] text-slate-400">
				<Clock size={11} />
				Duration: {months} bulan {days} hari {isCurrent ? "(berjalan)" : ""}
			    </p>
			</div>
		    </div>
		);
	    })}
	</TimelineWrap>
	    :
	    <div className="relative space-y-6 pl-6">No user yet</div>
    );
}

function TicketTimeline({tickets } : {tickets: ITicketForAsset[] | undefined}) {
    const navigate = useNavigate();
    return (
	tickets ?
	<TimelineWrap>
	    {tickets.map((t) => {
		const s = statusStyles.solved;
		return (
		    <div key={t.id} className="relative">
			<span className={`absolute -left-6 top-1 h-3 w-3 rounded-full border-2 ${s.dot}`} />
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