import {
	User, MapPin, Mail, ShieldUser,
	AlertCircle, CheckCircle2, Clock, TicketSlash,
	UserX, UserCheck, Trash, Info, Sparkles, Bot
} from "lucide-react";
import { useState } from "react";
import { useLoaderData } from "react-router";
import { BackButton } from "@/components/back-button.tsx";
import { DetailCard, DetailCardItem } from "@/components/detail-card.tsx";
import { TicketCard } from "@/features/dashboard/components/ticket-card.tsx";
import { DialogContainer } from "@/components/dialog-container.tsx";
import { SyncUserTagsDialog } from "@/features/user/components/sync-user-tags-dialog.tsx";
import { UserRepository } from "@/data/repositories/user.repository.ts";
import type { IDetailUser } from "@/types/user.type.ts";
import { useLoading } from "@/context/LoadingContext.tsx";
import {
	isTicketCancelled,
	isTicketInProgress,
	isTicketOpen,
	isTicketPending,
	isTicketSolved,
} from "@/helper/helper.tsx";

export const UserDetailPage = () => {
	const user = useLoaderData<IDetailUser>();
	const { showLoading, hideLoading } = useLoading();
	const [openSyncAiDialog, setOpenSyncAiDialog] = useState(false);
	const tickets = user.tickets || [];

	const totalTickets = tickets.length;
	const isUserInUse = totalTickets > 0;
	const openTickets = tickets.filter((t) => isTicketOpen(t.status)).length;
	const inProgressTickets = tickets.filter((t) => isTicketInProgress(t.status) || isTicketPending(t.status)).length;
	const closedTickets = tickets.filter((t) => isTicketSolved(t.status)).length;
	const cancelledTickets = tickets.filter((t) => isTicketCancelled(t.status)).length;

	return (
		<div className="w-full space-y-6">
			<BackButton />
			<div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
				<div className="flex items-center gap-4">
					<div className="p-4 bg-blue-50 text-ptba-primary rounded-xl">
						<User className="w-8 h-8" />
					</div>
					<div>
						<h1 className="text-2xl font-bold text-ptba-text flex items-center gap-2">
							{user.fullName}
						</h1>
						<p className="text-sm text-gray-500 font-medium">{user.username}</p>
					</div>
				</div>

				<div className="flex flex-col md:flex-row items-end md:items-center gap-4">
					<div className="flex flex-col items-end gap-1">
						<span className="text-xs font-semibold uppercase text-gray-400 tracking-wider">Status</span>
						<span className={`text-sm font-semibold flex items-center gap-1.5 ${user.active ? 'text-green-600' : 'text-red-500'}`}>
							<span className={`w-2 h-2 rounded-full ${user.active ? 'bg-green-600' : 'bg-red-500'}`} />
							{user.active ? 'Active' : 'Inactive'}
						</span>
					</div>

					<div className="flex items-center gap-2 pl-0 md:pl-3 border-l-0 md:border-l border-gray-200">
						<button
							type="button"
							onClick={() => setOpenSyncAiDialog(true)}
							className="px-3 py-1.5 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200/80 cursor-pointer"
						>
							<Sparkles className="w-3.5 h-3.5 text-purple-600" />
							<span>Sync AI Tags & Review</span>
						</button>

						<DialogContainer
							triggerRender={
								<button
									type="button"
									className={`px-3 py-1.5 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
										user.active
											? 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200/80'
											: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/80'
									}`}
								>
									{user.active ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
									<span>{user.active ? 'Deactivate User' : 'Activate User'}</span>
								</button>
							}
							title={user.active ? 'Deactivate User' : 'Activate User'}
							description={
								user.active
									? `Are you sure you want to deactivate user ${user.fullName}? The user will not be able to log in.`
									: `Are you sure you want to reactivate user ${user.fullName}?`
							}
							variant={user.active ? 'warning' : 'success'}
							icon={<Info className={user.active ? "text-amber-500 w-4 h-4" : "text-emerald-500 w-4 h-4"} />}
							onContinue={async () => {
								await UserRepository.toggleUserStatus(user.id);
								window.location.reload();
							}}
						/>

						{!isUserInUse && (
							<DialogContainer
								triggerRender={
									<button
										type="button"
										className="px-3 py-1.5 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200/80 cursor-pointer"
									>
										<Trash className="w-3.5 h-3.5" />
										<span>Delete</span>
									</button>
								}
								title="Remove User"
								description="Are you sure to remove this user? This action cannot be undone!"
								variant="danger"
								icon={<Info className="text-danger w-4 h-4" />}
								onContinue={async () => {
									await UserRepository.deleteUser(user.id);
									window.location.href = '/users';
								}}
							/>
						)}
					</div>
				</div>
			</div>

			<SyncUserTagsDialog
				open={openSyncAiDialog}
				onOpenChange={setOpenSyncAiDialog}
				userId={user.id}
				userName={user.fullName}
			/>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
				{/* KIRI: Employee Information */}
				<DetailCard title="Employee Information" Icon={User} className="lg:col-span-1">
					<div className="space-y-4">
						<DetailCardItem title="Position" Icon={Mail} value={user.email} />
						<DetailCardItem title="Department" Icon={ShieldUser} value={user.role} />
						<DetailCardItem title="Work Location" Icon={MapPin} value={user.workLocation?.name || '-'} />

						{user.tags && user.tags.length > 0 && (
							<div className="pt-2 border-t border-gray-100 space-y-1.5">
								<span className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1">
									<Sparkles className="w-3 h-3 text-purple-500" /> Specialization Tags
								</span>
								<div className="flex flex-wrap gap-1.5 pt-1">
									{user.tags.map((tag, idx) => (
										<span key={idx} className="px-2.5 py-1 rounded-md text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200/80 shadow-2xs">
											{tag}
										</span>
									))}
								</div>
							</div>
						)}

						{user.review && (
							<div className="pt-3 border-t border-gray-100 space-y-1.5">
								<span className="text-xs font-semibold text-purple-700 uppercase tracking-wider flex items-center gap-1">
									<Bot className="w-3.5 h-3.5 text-purple-600" /> AI Performance Review
								</span>
								<div className="bg-purple-50/60 border border-purple-100 rounded-xl p-3 text-xs text-slate-700 leading-relaxed font-normal shadow-2xs">
									{user.review}
								</div>
							</div>
						)}
					</div>
				</DetailCard>

				{/* KANAN: Ticket Cards Dashboard */}
				<div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
					<TicketCard
						label="Total Ticket"
						value={totalTickets}
						status={'total'}
						Icon={AlertCircle}
					/>
					<TicketCard
						label="Open Ticket"
						value={openTickets}
						status={'open'}
						Icon={Clock}
					/>
					<TicketCard
						label="Ticket on Progress"
						value={inProgressTickets}
						status={'progress'}
						Icon={AlertCircle}
					/>
					<TicketCard
						label="Closed Ticket"
						value={closedTickets}
						status={'closed'}
						Icon={CheckCircle2}
					/>
					<TicketCard
						label="Cancelled Ticket"
						value={cancelledTickets}
						status={'cancelled'}
						Icon={TicketSlash}
					/>
				</div>
			</div>
		</div>
	);
};



