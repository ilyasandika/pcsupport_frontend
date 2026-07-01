import {capitalizeWords, getSlaStyleByDuration, getStatusBadgeStyle} from "../../../helper/helper.tsx";
import { useLoaderData } from "react-router";
import type { ITicket } from "../../../types/ticket.type.ts";

export const TicketDetailPage = () => {
    const ticket = useLoaderData<ITicket>()
    console.log(ticket)
    const slaStyle = getSlaStyleByDuration(ticket.slaPolicy.resolutionTimeSeconds)
    return (
	<div className="min-h-screen bg-slate-50 p-6 font-sans text-slate-900">
	    <div className="max-w-7xl mx-auto space-y-6">

		{/* --- 1. HEADER SECTION --- */}
		<div className="flex flex-col md:flex-row md:items-center md:justify-between bg-white p-6 rounded-xl border border-slate-200 shadow-xs gap-4">
		    <div>
			<div className="flex items-center gap-3">
			    <h1 className="text-2xl font-bold tracking-tight">Ticket No. {ticket.fullNumber ?? '-'}</h1>
			    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border uppercase tracking-wider ${getStatusBadgeStyle(ticket.status)}`}>
                             {ticket.status}
                          </span>
			</div>

		    </div>

		    {/* Action Buttons */}
		    {/*<div className="flex items-center gap-2 self-start md:self-center">*/}
			{/*<button className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition">*/}
			{/*    Assign*/}
			{/*</button>*/}
			{/*<button className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition">*/}
			{/*    Update Status*/}
			{/*</button>*/}
			{/*<button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-xs transition">*/}
			{/*    Close Ticket*/}
			{/*</button>*/}
		    {/*</div>*/}
		</div>

		{/* --- 2. FULL-WIDTH SLA & TIMELINE BANNER --- */}
		<div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
		    {/* Mini Header Banner */}
		    <div className={`${slaStyle.header} ${slaStyle.accentText} px-6 py-2.5 flex justify-between items-center `}>
                       <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                           ⏱️ SLA Policy: <span className={`${slaStyle.accentText} normal-case font-semibold`}>{ticket.slaPolicy.name}</span>
                       </span>
			<span className={`text-[11px] px-2 py-0.5 rounded font-medium ${slaStyle.hourType}`}>
                           {ticket.slaPolicy.isBusinessHourOnly ?
			       '💼 Business Hours Only' :
			       '🕒 24/7 Support'}
                       </span>
		    </div>

		    {/* Main Comparison Grid */}
		    <div className="grid grid-cols-1 md:grid-cols-2  p-6 gap-6 bg-white">

			{/* Left Side: SLA Targets */}
			<div className="flex flex-col space-y-3">
			    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">SLA Target</h3>
			    <div className="grid grid-cols-2 gap-4 flex-1">
				<div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex flex-col justify-center">
				    <p className="text-xs text-slate-500">Response Target</p>
				    <p className="text-lg font-bold text-slate-800 mt-0.5">{ticket.slaPolicy.responseTimeSeconds / 60} <span className="text-xs font-normal text-slate-500">Menit</span></p>
				</div>
				<div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex flex-col justify-center">
				    <p className="text-xs text-slate-500">Resolution Target</p>
				    <p className="text-lg font-bold text-slate-800 mt-0.5">{ticket.slaPolicy.resolutionTimeSeconds / 3600} <span className="text-xs font-normal text-slate-500">Jam</span></p>
				</div>
			    </div>
			</div>

			{/* Right Side: Actual Execution Timeline */}
			<div className="flex flex-col space-y-3 pt-4 md:pt-0 md:pl-6">
			    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Actual Timeline</h3>
			    {/* h-full SUDAH DIHAPUS, diganti flex-1 agar tingginya presisi mengikuti parent tanpa meluber */}
			    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1">
				<div className="bg-blue-50/40 p-2.5 rounded-lg border border-blue-100 flex flex-col justify-center">
				    <p className="text-[11px] font-medium text-blue-600">Created</p>
				    <p className="text-xs font-semibold text-slate-700 mt-0.5 leading-tight">{new Date(ticket.createdAt).toLocaleString('id-ID')}</p>
				</div>
				<div className="bg-amber-50/40 p-2.5 rounded-lg border border-amber-100 flex flex-col justify-center">
				    <p className="text-[11px] font-medium text-amber-700">Started</p>
				    <p className="text-xs font-semibold text-slate-700 mt-0.5 leading-tight">
					{ticket.startAt ? new Date(ticket.startAt).toLocaleString('id-ID') : <span className="text-slate-400 italic font-normal">Not started</span>}
				    </p>
				</div>
				{/* Mengganti warna merah menyala dengan green-50 agar senada jika solved / status normal */}
				<div className="bg-green-50/40 p-2.5 rounded-lg border border-green-100 flex flex-col justify-center">
				    <p className="text-[11px] font-medium text-green-700">Solved</p>
				    <p className="text-xs font-semibold text-slate-700 mt-0.5 leading-tight">
					{ticket.solvedAt ? new Date(ticket.solvedAt).toLocaleString('id-ID') : <span className="text-slate-400 italic font-normal">Not solved</span>}
				    </p>
				</div>
			    </div>
			</div>

		    </div>
		</div>

		{/* --- 3. MAIN CONTENT LAYOUT (SLA Removed from Sidebar) --- */}
		<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

		    {/* LEFT COLUMN: Main Content (66%) */}
		    <div className="lg:col-span-2 space-y-6">

			{/* Problem Card */}
			<div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-3">
			    <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Problem</h2>
			    <p className="text-base leading-relaxed text-slate-800 bg-slate-50 p-4 rounded-lg border border-slate-100 whitespace-pre-wrap">
				{ticket.problem}
			    </p>
			</div>

			{/* Solution & Remarks Card */}
			<div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
			    <div className="space-y-2">
				<h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Solution</h2>
				{ticket.solution ? (
				    <p className="text-base text-slate-800 bg-green-50/50 p-4 rounded-lg border border-green-100">{ticket.solution}</p>
				) : (
				    <p className="text-sm italic text-slate-400 bg-slate-50 p-4 rounded-lg border border-dashed border-slate-200">No solution yet.</p>
				)}
			    </div>

			    <div className="border-t border-slate-100 pt-4 space-y-2">
				<h3 className="text-xs font-semibold text-slate-500 uppercase">Remarks</h3>
				<p className="text-sm text-slate-600">{ticket.remarks ?? '-'}</p>
			    </div>
			</div>

		    </div>

		    {/* RIGHT COLUMN: Sidebar Metadata (33%) */}
		    <div className="space-y-6">

			{/* Lokasi Kerja (Moved to top of sidebar) */}
			<div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex justify-between items-center text-sm">
			    <span className="text-slate-500 font-medium uppercase text-xs tracking-wider">Work Location</span>
			    <span className="font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg border border-blue-100">{ticket.location.name}</span>
			</div>

			{/* Pelapor (Employee) Information */}
			<div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
			    <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">Employee</h2>
			    {ticket.employee ?
				<div className="space-y-2 text-sm">
				    <div className="flex justify-between"><span className="text-slate-500">Nama</span><span className="font-medium text-slate-800">{ticket.employee.name}</span></div>
				    <div className="flex justify-between"><span className="text-slate-500">NIK</span><span className="font-mono text-slate-700">{ticket.employee.nik}</span></div>
				    <div className="flex justify-between"><span className="text-slate-500">Jabatan</span><span className="text-slate-800 text-right">{ticket.employee.position}</span></div>
				    <div className="flex justify-between"><span className="text-slate-500">Departemen</span><span className="text-slate-800 text-right text-xs max-w-[180px] truncate" title={ticket.employee.department}>{ticket.employee.department}</span></div>
				</div>
				:
				<span>No Employee</span>
			    }
			</div>

			{/* Engineer Information */}
			<div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
			    <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">Assigned Engineer</h2>
			    {ticket.engineer ?
				<div className="space-y-2 text-sm">
				    <div className="flex justify-between"><span className="text-slate-500">Nama</span><span className="font-medium text-slate-800">{ticket.engineer.fullName}</span></div>
				    <div className="flex justify-between"><span className="text-slate-500">Role</span><span className="text-slate-600">{capitalizeWords(ticket.engineer.role)}</span></div>
				</div>
				:
				<span>No Engineer</span>
			    }
			</div>

			{/* Asset Information */}
			<div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
			    <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">Asset Information</h2>
			    {ticket.asset ?
				<div className="space-y-2 text-sm">
				    <div className="flex justify-between"><span className="text-slate-500">Hostname</span><span className="font-mono font-medium text-slate-800">{ticket.asset.hostname}</span></div>
				    <div className="flex justify-between"><span className="text-slate-500">Asset Tag</span><span className="bg-slate-100 px-1.5 py-0.5 rounded text-xs font-mono text-slate-700">{ticket.asset.assetTag}</span></div>
				    <div className="flex justify-between"><span className="text-slate-500">Serial No</span><span className="font-mono text-slate-600">{ticket.asset.serialNumber}</span></div>
				    <div className="flex justify-between"><span className="text-slate-500">Kategori</span><span className="text-slate-800">{ticket.asset.category.name}</span></div>
				</div>
				:
				<span>No Asset</span>
			    }
			</div>

		    </div>

		</div>
	    </div>
	</div>
    );
}