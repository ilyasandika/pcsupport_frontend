import {useState, } from "react";
import {
    Laptop,
    Barcode,
    ShieldCheck,
    Cable,
    Briefcase,
    User,
    Wrench,
    AlertTriangle,
    LaptopIcon,
} from "lucide-react";
import {Card} from "../../../components/card.tsx";
import {CardRow} from "../../../components/card-row.tsx";
import {useLoaderData} from "react-router";
import type {IDetailAsset} from "../../../types/asset.type.ts";
import {byteToStringMb, fmtDate} from "../../../helper/helper.tsx";
import {BackButton} from "../../../components/back-button.tsx";
import {TicketTimeline} from "../../ticket/components/ticket-timeline.tsx";
import {AssetAssignmentTimelineEmployee} from "../../asset-assignment/components/asset-assignment-timeline.tsx";
import {TabButton} from "../../../components/tab-button.tsx";

// ---------- helpers ----------


export const AssetDetailPage = () => {
    const [tab, setTab] = useState("user");
    const asset = useLoaderData<IDetailAsset>()

    const openTickets = asset.tickets?.filter((t) => t.status == "open" || t.status == "in progress") || [];

    return (
	<div className="min-h-screen bg-slate-50 font-sans text-ptba-text">
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
			    {tab === "user" ? <AssetAssignmentTimelineEmployee assetAssignments={asset.assetAssignments} /> : <TicketTimeline tickets={asset.tickets} />}
			</div>
		    </div>
		</div>
	    </div>
	</div>
    );
}


