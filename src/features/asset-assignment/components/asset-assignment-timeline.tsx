
import {TimelineWrap} from "../../../components/timeline-wrap.tsx";
import {fmtDate, monthsDaysBetween} from "../../../helper/helper.tsx";
import {Clock} from "lucide-react";
import type {IDetailAssetAssignment} from "../../../types/asset-assignment.type.ts";
import {Link, useNavigate} from "react-router";

export const  AssetAssignmentTimelineEmployee = ({assetAssignments} : {assetAssignments: IDetailAssetAssignment[] | undefined}) => {
    const navigate = useNavigate();
    return (
	assetAssignments ?
	    <TimelineWrap>
		{assetAssignments.map((u) => {
		    const isCurrent = !u.returnedAt;
		    const { months, days } = monthsDaysBetween(u.assignedAt, u.returnedAt || new Date().toDateString())
		    return (
			<div key={u.employee.nik} className="relative">
			<span
			    className={`absolute -left-6 top-1 h-3 w-3 rounded-full border-2 bg-white ${
				isCurrent ? "border-emerald-500" : "border-slate-300"
			    }`}
			/>
			    <div className="flex items-baseline justify-between gap-2">
				<div className="flex gap-1 flex-col">
				    <div className="flex gap-2">
					<span className="font-semibold text-ptba-text cursor-pointer" onClick={()=> navigate(`/employees/${u.employee.nik}`)}>{u.employee.name}</span>
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


export const  AssetAssignmentTimelineAsset = ({assetAssignments} : {assetAssignments: IDetailAssetAssignment[] | undefined}) => {
    return (
	assetAssignments ?
	    <TimelineWrap>
		{assetAssignments.map((u) => {
		    const isCurrent = !u.returnedAt;
		    const { months, days } = monthsDaysBetween(u.assignedAt, u.returnedAt || new Date().toDateString())
		    return (
			<div key={u.asset.serialNumber} className="relative">
			<span
			    className={`absolute -left-6 top-1 h-3 w-3 rounded-full border-2 bg-white ${
				isCurrent ? "border-emerald-500" : "border-slate-300"
			    }`}
			/>
			    <div className="flex items-baseline justify-between gap-2">
				<div className="flex gap-1 flex-col">
				    <div className="flex gap-2">
					<Link to={`/assets/${u.asset.serialNumber}`} className="font-semibold text-ptba-text cursor-pointer">{`${u.asset.brand || "ab"} ${u.asset.model || "cd"}`}</Link>
					<span className="rounded-md border border-slate-200 bg-white px-2 py-0.5  text-[11px] text-slate-500">
					    Tag {u.asset.assetTag}
					</span><span className="rounded-md border border-slate-200 bg-white px-2 py-0.5  text-[11px] text-slate-500">
					    SN: {u.asset.serialNumber}
					</span>
				    </div>
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