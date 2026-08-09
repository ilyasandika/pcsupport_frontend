import { useState} from "react";
import {
    User, Calendar, MapPin, Briefcase,
    Laptop, Wrench, Building
} from "lucide-react";
import {useLoaderData } from "react-router";
import type {IDetailEmployee} from "@/types/employee.type.ts";
import {BackButton} from "@/components/back-button.tsx";
import {TabButton} from "@/components/tab-button.tsx";
import {AssetAssignmentTimelineAsset} from "../../asset-assignment/components/asset-assignment-timeline.tsx";
import {DetailCard} from "@/components/detail-card.tsx";
import {DetailCardItem} from "@/components/detail-card.tsx";
import {TicketTimeline} from "../../ticket/components/ticket-timeline.tsx";

export const EmployeeDetailPage = () => {
    const [tab, setTab] = useState<'assets' | 'tickets'>('assets');
    const employee = useLoaderData<IDetailEmployee>()

    return (
	<div className="w-full space-y-6">
	    <BackButton/>
	    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
		<div className="flex items-center gap-4">
		    <div className="p-4 bg-blue-50 text-ptba-primary rounded-xl">
			<User className="w-8 h-8" />
		    </div>
		    <div>
			<h1 className="text-2xl font-bold text-ptba-text flex items-center gap-2">
			    {employee.name}
			    <span className={`px-2 py-0.5 text-xs font-semibold rounded uppercase ${
				employee.contractType === 'organik' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'
			    }`}>
                                {employee.contractType}
                            </span>
			</h1>
			<p className="text-sm text-gray-500 font-medium">NIK: {employee.nik || '-'}</p>
		    </div>
		</div>

		<div className="flex flex-col items-end gap-1">
		    <span className="text-xs font-semibold uppercase text-gray-400 tracking-wider">Status</span>
		    <span className={`text-sm font-semibold flex items-center gap-1.5 ${employee.status ? 'text-green-600' : 'text-red-500'}`}>
                        <span className={`w-2 h-2 rounded-full ${employee.status ? 'bg-green-600' : 'bg-red-500'}`} />
			{employee.status ? 'Aktif' : 'Non-Aktif'}
                    </span>
		</div>
	    </div>

	    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
		<DetailCard title="Employee Information" Icon={User}>
		    <div className="space-y-4">
			<DetailCardItem title="Position" Icon={Briefcase} value={employee.position}/>
			<DetailCardItem title="Department" Icon={Building} value={employee.department}/>
			<DetailCardItem title="Work Location" Icon={MapPin} value={"Jakarta TODO"}/>
			<DetailCardItem
			    title="Retire Date"
			    Icon={Calendar}
			    value={employee.retireDate
				? new Date(employee.retireDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
				: '-'
			    }
			/>

		    </div>
		</DetailCard>

		{/* KANAN: TAB HISTORI ASET DAN TIKET */}
		<div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs p-6">
		    <div className="flex gap-6 border-b border-slate-100">
			<TabButton
			    active={tab === "assets"}
			    onClick={() => setTab("assets")}
			    Icon={Laptop}
			    label="Asset Histories"
			    count={employee.assetAssignments?.length || 0}
			/>
			<TabButton
			    active={tab === "tickets"}
			    onClick={() => setTab("tickets")}
			    Icon={Wrench}
			    label="Ticket & Maintenance Histories"
			    count={employee.tickets?.length || 0}
			/>
		    </div>

		    <div className="pt-6">
			{tab === "assets" ? <AssetAssignmentTimelineAsset assetAssignments={employee.assetAssignments} />
			    :
			    <TicketTimeline tickets={employee.tickets}/>
			}
		    </div>
		</div>
	    </div>
	</div>
    );
};


