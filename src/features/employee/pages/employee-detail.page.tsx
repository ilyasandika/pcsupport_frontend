import {useState} from "react";
import {
    User, Calendar, Shield, MapPin, Briefcase,
    Laptop, Ticket, CheckCircle2, AlertCircle, Clock
} from "lucide-react";
import {useLoaderData, useNavigate} from "react-router";
import type {IEmployee} from "../../../types/employee.type.ts";
import {BackButton} from "../../../components/back-button.tsx";
import type {ITicketForAsset} from "../../../types/ticket.type.ts";
import {getStatusBadgeStyle} from "../../../helper/helper.tsx";

export const EmployeeDetailPage = () => {
    const [activeTab, setActiveTab] = useState<'assets' | 'tickets'>('assets');
    const employee = useLoaderData<IEmployee>()

    return (
	<div className="w-full space-y-6 p-1">
	    <BackButton/>
	    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
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
		    <span className="text-xs font-semibold uppercase text-gray-400 tracking-wider">Status Akun</span>
		    <span className={`text-sm font-semibold flex items-center gap-1.5 ${employee.status ? 'text-green-600' : 'text-red-500'}`}>
                        <span className={`w-2 h-2 rounded-full ${employee.status ? 'bg-green-600' : 'bg-red-500'}`} />
			{employee.status ? 'Aktif' : 'Non-Aktif'}
                    </span>
		</div>
	    </div>

	    {/* GRID UTAMA */}
	    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

		{/* KIRI: INFORMASI DETIL KARYAWAN */}
		<div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-6 lg:col-span-1">
		    <h3 className="text-sm font-bold text-ptba-text uppercase tracking-wider border-b border-gray-100 pb-2">
			Detail Informasi
		    </h3>

		    <div className="space-y-4">
			<div className="flex items-start gap-3">
			    <Briefcase className="w-4 h-4 text-gray-400 mt-1" />
			    <div>
				<p className="text-xs text-gray-400 font-medium">Jabatan & Posisi</p>
				<p className="text-sm font-semibold text-ptba-text">{employee.position || '-'}</p>
				<p className="text-xs text-gray-500">ID: {employee.positionId || '-'}</p>
			    </div>
			</div>

			<div className="flex items-start gap-3">
			    <MapPin className="w-4 h-4 text-gray-400 mt-1" />
			    <div>
				<p className="text-xs text-gray-400 font-medium">Unit Organisasi</p>
				<p className="text-sm font-semibold text-ptba-text">{employee.department || '-'}</p>
				<p className="text-xs text-gray-500">{employee.division || '-'} • {employee.directorate || '-'}</p>
			    </div>
			</div>

			<div className="flex items-start gap-3">
			    <Shield className="w-4 h-4 text-gray-400 mt-1" />
			    <div>
				<p className="text-xs text-gray-400 font-medium">FS / MJL / Agama</p>
				<p className="text-sm font-semibold text-ptba-text">
				    {employee.fs || '-'} / {employee.mjl || '-'}
				</p>
				<p className="text-xs text-gray-500 font-medium uppercase">{employee.religion || '-'}</p>
			    </div>
			</div>

			<div className="flex items-start gap-3">
			    <Calendar className="w-4 h-4 text-gray-400 mt-1" />
			    <div>
				<p className="text-xs text-gray-400 font-medium">Tanggal Pensiun</p>
				<p className="text-sm font-semibold text-ptba-text">
				    {employee.retireDate
					? new Date(employee.retireDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
					: '-'
				    }
				</p>
			    </div>
			</div>
		    </div>
		</div>

		{/* KANAN: TAB HISTORI ASET DAN TIKET */}
		<div className="bg-white border border-gray-200 rounded-2xl shadow-sm lg:col-span-2 overflow-hidden">
		    {/* Header Tab */}
		    <div className="flex border-b border-gray-200 bg-gray-50/50 px-4">
			<button
			    onClick={() => setActiveTab('assets')}
			    className={`flex items-center gap-2 py-4 px-4 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
				activeTab === 'assets'
				    ? 'border-ptba-primary text-ptba-primary'
				    : 'border-transparent text-gray-500 hover:text-gray-700'
			    }`}
			>
			    <Laptop className="w-4 h-4" />
			    Histori Laptop / Aset
			</button>
			<button
			    onClick={() => setActiveTab('tickets')}
			    className={`flex items-center gap-2 py-4 px-4 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
				activeTab === 'tickets'
				    ? 'border-ptba-primary text-ptba-primary'
				    : 'border-transparent text-gray-500 hover:text-gray-700'
			    }`}
			>
			    <Ticket className="w-4 h-4" />
			    Histori Tiket IT Support
			</button>
		    </div>

		    {/* Konten Tab */}
		    <div className="p-6">
			{/* TAB HISTORI LAPTOP/ASET */}
			{activeTab === 'assets' && (
			    <div className="space-y-4">
				{employee.assetAssignments?.length === 0 ? (
				    <p className="text-sm text-gray-400 py-4 text-center">Tidak ada riwayat pemakaian aset.</p>
				) : (
				    <div className="relative border-l border-gray-200 ml-3 pl-6 space-y-6">
					{employee.assetAssignments?.map((assetAssginment) => (
					    <div key={assetAssginment.id} className="relative">
						{/* Penanda Node Garis Waktu */}
						<span className={`absolute -left-[31px] top-1 flex items-center justify-center w-4 h-4 rounded-full ring-4 ring-white ${
						    assetAssginment.status === 'active' ? 'bg-blue-500' : 'bg-gray-300'
						}`} />

						<div className="flex justify-between items-start gap-4">
						    <div>
							<h4 className="font-semibold text-sm text-ptba-text">
							    <span>{assetAssginment?.asset?.brand}</span>
							    <span>{assetAssginment?.asset?.model}</span>
							</h4>
							<p className="text-xs font-mono text-gray-500">Tag: {assetAssginment?.asset?.assetTag}</p>
							<p className="text-xs text-gray-400 mt-1">
							    Mulai: {new Date(assetAssginment.assignedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
							    {assetAssginment.returnedAt && ` • Selesai: ${new Date(assetAssginment.returnedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}`}
							</p>
						    </div>
						    <span className={`px-2 py-0.5 text-xs font-medium rounded ${
							assetAssginment.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
						    }`}>
                                                        {assetAssginment.status === 'active' ? 'Sedang Digunakan' : 'Sudah Dikembalikan'}
                                                    </span>
						</div>
					    </div>
					))}
				    </div>
				)}
			    </div>
			)}

			{/* TAB HISTORI TIKET */}
			{activeTab === 'tickets' && (
			    <div className="space-y-4">
				{employee.tickets?.length === 0 ? (
				    <p className="text-sm text-gray-400 py-4 text-center">Belum pernah membuat tiket pengaduan.</p>
				) : (
				    <div className="divide-y divide-gray-100">
					{employee.tickets?.map((ticket) => (
					    <div key={ticket.id} className="py-3 flex justify-between items-center gap-4 first:pt-0 last:pb-0">
						<div className="space-y-0.5">
						    <h4 className="font-medium text-sm text-ptba-text hover:text-ptba-primary transition-colors cursor-pointer">
							{ticket.problem}
						    </h4>
						    <div className="flex items-center gap-2 text-xs text-gray-400">
							<span className="font-medium bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">{ticket.engineer?.username}</span>
							<span>•</span>
							<span>{new Date(ticket.startAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
						    </div>
						</div>

						{/* Badge Status Tiket */}
						<span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
						    ticket.status === 'resolved' || ticket.status === 'closed' ? 'bg-green-50 text-green-700' :
							ticket.status === 'in_progress' ? 'bg-yellow-50 text-yellow-700' : 'bg-red-50 text-red-700'
						}`}>
                                                    {ticket.status === 'resolved' || ticket.status === 'closed' ? <CheckCircle2 className="w-3.5 h-3.5" /> :
							ticket.status === 'in_progress' ? <Clock className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
						    {ticket.status === 'resolved' ? 'Selesai' :
							ticket.status === 'closed' ? 'Closed' :
							    ticket.status === 'in_progress' ? 'Diproses' : 'Terbuka'}
                                                </span>
					    </div>
					))}
				    </div>
				)}
			    </div>
			)}
		    </div>
		</div>

	    </div>
	</div>
    );
};



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