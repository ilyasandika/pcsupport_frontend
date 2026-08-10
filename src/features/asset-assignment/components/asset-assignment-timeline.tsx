import { useState } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserPlus, Undo2, Clock, FilePlusCorner, FileSearchCorner, FileCog, Search, Pencil } from "lucide-react";
import { TimelineWrap } from "@/components/timeline-wrap.tsx";
import { fmtDate, monthsDaysBetween } from "@/helper/helper.tsx";
import type { IDetailAssetAssignment } from "@/types/asset-assignment.type.ts";
import { Link, useNavigate } from "react-router";
import { ReturnAssetDialog } from "@/features/asset-assignment/components/return-asset-assignment-dialog.tsx";
import { CreateAssetAssignDialog } from "@/features/asset-assignment/components/asset-assignment-dialog.tsx";
import { EditAssetAssignmentDialog } from "@/features/asset-assignment/components/edit-asset-assignment-dialog.tsx";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import {
	UploadBastAssignmentDialog
} from "@/features/asset-assignment/components/upload-bast-assignment-dialog.tsx";
import { AssetAssignmentRepository } from "@/data/repositories/asset-assignment.repository.ts";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { GeneratePdfDialog } from "@/features/user/components/generate-pdf-dialog.tsx";
import { AssetStatus, type IDetailAsset } from "@/types/asset.type.ts";


interface AssetAssignmentTimelineEmployeeProps {
	asset: IDetailAsset;
	assetAssignments: IDetailAssetAssignment[] | undefined;
	onChanged?: () => void;
	maxHeight?: string;
}

export const EmployeeTimelineByAsset = ({
	asset,
	assetAssignments,
	onChanged,
	maxHeight = "420px",
}: AssetAssignmentTimelineEmployeeProps) => {
	const navigate = useNavigate();
	const [assignOpen, setAssignOpen] = useState(false);
	const [returnTarget, setReturnTarget] = useState<{ id: number; employeeName?: string } | null>(null);
	const [editTarget, setEditTarget] = useState<IDetailAssetAssignment | null>(null);

	const [generateTarget, setGenerateTarget] = useState<IDetailAssetAssignment>({} as IDetailAssetAssignment);
	const [type, setType] = useState<'assign' | 'return'>('assign');
	const [openGenerateDialog, setOpenGenerateDialog] = useState<boolean>(false);

	const [uploadTarget, setUploadTarget] = useState<{ id: number; employeeName?: string; type: 'assign' | 'return' } | null>(null);
	const [searchQuery, setSearchQuery] = useState("");

	const activeAssignment = assetAssignments?.find((a) => !a.returnedAt);
	const allowedStatus = [
		AssetStatus.Backup,
		AssetStatus.Returned,
		AssetStatus.ReadyStock,
		AssetStatus.Undeployed,
	] as const;
	const allowedToAssign = () => {
		return allowedStatus.some((s) => asset.status === s);
	};


	const filteredAssignments = assetAssignments?.filter((assignment) => {
		if (!searchQuery) return true;
		const query = searchQuery.toLowerCase();
		return (
			assignment.employee.name.toLowerCase().includes(query) ||
			assignment.employee.nik.toLowerCase().includes(query) ||
			assignment.employee.position?.toLowerCase().includes(query) ||
			assignment.employee.department?.toLowerCase().includes(query) ||
			assignment.userNonEmployeeName?.toLowerCase().includes(query) ||
			assignment.remarks?.toLowerCase().includes(query)
		);
	});

	return (
		<div className="flex flex-col gap-3">
			<div className="flex justify-end gap-4 items-center mb-4">
				<InputGroup>
					<InputGroupInput
						placeholder="Search by name, NIK, position, department..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
					<InputGroupAddon>
						<Search />
					</InputGroupAddon>
				</InputGroup>

				<Tooltip open={allowedToAssign() ? false : undefined} >
					<TooltipTrigger>
						<Button
							size="sm"
							onClick={() => setAssignOpen(true)}
							disabled={!!activeAssignment || !allowedToAssign()}
						>
							<UserPlus className="size-4 mr-1.5" />
							New User
						</Button>
					</TooltipTrigger>
					<TooltipContent className="text-center">
						<span>
							{!!activeAssignment ? "Cannot assign when there is an active assignment" : !allowedToAssign() && `Cannot assign when asset is not in this status (${allowedStatus.join(", ")})`}
						</span>
					</TooltipContent>
				</Tooltip>
			</div>

			{assetAssignments && assetAssignments.length > 0 ? (
				<ScrollArea style={{ height: maxHeight }} className="pr-4">
					<TimelineWrap>
						{filteredAssignments && filteredAssignments.length > 0 ? (
							filteredAssignments.map((u) => {
								const isCurrent = !u.returnedAt;
								const { months, days } = monthsDaysBetween(u.assignedAt, u.returnedAt || new Date().toDateString());
								return (
									<div key={u.id} className="relative">
										<span
											className={`absolute -left-6 top-1 h-3 w-3 rounded-full border-2 bg-white ${isCurrent ? "border-emerald-500" : "border-slate-300"
												}`}
										/>
										<div className="flex items-baseline justify-between gap-2">
											<div className="flex gap-1 flex-col">
												<div className="flex items-center gap-2">
													<span
														className="font-semibold text-ptba-text cursor-pointer hover:underline"
														onClick={() => navigate(`/employees/${u.employee.nik}`)}
													>
														{u.employee.name}
													</span>
													<Badge variant="outline" className="text-[11px] font-normal text-slate-500">
														NIK {u.employee.nik}
													</Badge>
												</div>
												<p className="text-xs text-slate-500">{u.employee.position}</p>
												<p className="text-xs text-slate-500">{u.employee.department}</p>
											</div>
											<p className="whitespace-nowrap text-xs text-slate-400">
												{fmtDate(u.assignedAt)} → {!u.returnedAt ? "now" : fmtDate(u.returnedAt)}
											</p>
										</div>

										<div
											className={`mt-2 rounded-lg border p-3.5 ${isCurrent ? "bg-emerald-50/40 border-emerald-100" : "bg-slate-50 border-slate-100"
												}`}
										>
											<div className="mb-2 flex flex-wrap items-center justify-between gap-2">
												<ScrollArea className="w-4/6">
													<div className="flex w-max flex-wrap items-center gap-2">
														<Badge
															variant="outline"
															className={`rounded-full text-[11px] font-semibold uppercase tracking-wider ${isCurrent
																? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50"
																: "bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-100"
																}`}
														>
															{isCurrent ? `In Use ${u.isBackup ? "for Backup" : ""}` : `Returned ${u.isBackup ? "from Backup" : ""}`}
														</Badge>
														{u.userNonEmployeeName && (
															<Badge variant="outline" className="text-[11px] font-normal text-slate-500">
																User: {u.userNonEmployeeName}
															</Badge>
														)}

														<Badge variant="outline" className={`text-[11px] font-normal ${u.assignFilePath ? 'bg-ptba-tertiary-light-green/30 text-ptba-tertiary-green' : 'bg-ptba-primary-yellow/30 text-ptba-secondary-orange'}`}>
															{u.assignFilePath ? 'Done BAST Assign' : 'Pending BAST Assign'}
														</Badge>
														<Badge variant="outline" className={`text-[11px] font-normal ${u.assignFilePath ? 'bg-ptba-tertiary-light-green/30 text-ptba-tertiary-green' : 'bg-ptba-primary-yellow/30 text-ptba-secondary-orange'}`}>
															{u.returnFilePath ? 'Done BAST Return' : 'Pending BAST Return'}
														</Badge>
													</div>
													<ScrollBar orientation="horizontal" hidden />
												</ScrollArea>
												<div className="flex flex-row gap-2 items-center">
													<DropdownMenu>
														<DropdownMenuTrigger>
															<Tooltip>
																<TooltipTrigger>
																	<Button variant="outline" size="sm">
																		<FileCog className="size-4" />
																	</Button>
																</TooltipTrigger>
																<TooltipContent>
																	Generate BAST
																</TooltipContent>
															</Tooltip>
														</DropdownMenuTrigger>
														<DropdownMenuContent>
															<DropdownMenuItem onClick={() => {
																setOpenGenerateDialog(true)
																setGenerateTarget(u)
																setType('assign')
															}}>
																BAST Assign
															</DropdownMenuItem>
															{!isCurrent && (
																<DropdownMenuItem onClick={() => {
																	setOpenGenerateDialog(true)
																	setGenerateTarget(u)
																	setType('return')
																}}>
																	BAST Return
																</DropdownMenuItem>
															)}
														</DropdownMenuContent>
													</DropdownMenu>

													<DropdownMenu>
														<DropdownMenuTrigger>
															<Tooltip>
																<TooltipTrigger>
																	<Button variant="outline" size="sm">
																		<FilePlusCorner className="size-4" />
																	</Button>
																</TooltipTrigger>
																<TooltipContent>
																	Upload BAST
																</TooltipContent>
															</Tooltip>
														</DropdownMenuTrigger>
														<DropdownMenuContent>
															<DropdownMenuItem onClick={() => setUploadTarget({ id: u.id, employeeName: u.employee.name, type: 'assign' })}>
																BAST Assign
															</DropdownMenuItem>
															{!isCurrent && (
																<DropdownMenuItem onClick={() => setUploadTarget({ id: u.id, employeeName: u.employee.name, type: 'return' })}>
																	BAST Return
																</DropdownMenuItem>
															)}
														</DropdownMenuContent>
													</DropdownMenu>

													{
														u.assignFilePath && (
															<DropdownMenu>
																<DropdownMenuTrigger asChild>
																	<Button variant="outline" size="sm">
																		<FileSearchCorner className="size-4" />
																		Detail BAST
																	</Button>
																</DropdownMenuTrigger>
																<DropdownMenuContent>
																	<DropdownMenuItem onClick={() => AssetAssignmentRepository.viewDocument(u.id, "assign")}>
																		BAST Assign
																	</DropdownMenuItem>
																	{!isCurrent && (
																		<DropdownMenuItem onClick={() => AssetAssignmentRepository.viewDocument(u.id, "return")}>
																			BAST Return
																		</DropdownMenuItem>
																	)}
																</DropdownMenuContent>
															</DropdownMenu>
														)
													}
													<Tooltip>
														<TooltipTrigger>
															<Button variant="outline" size="sm" onClick={() => setEditTarget(u)}>
																<Pencil className="size-4" />
															</Button>
														</TooltipTrigger>
														<TooltipContent>
															Edit Assignment
														</TooltipContent>
													</Tooltip>

													{isCurrent && (
														<Tooltip>
															<TooltipTrigger>
																<Button variant="outline" size="sm" onClick={() => setReturnTarget({ id: u.id, employeeName: u.employee.name })}>
																	<Undo2 className="size-4" />
																</Button>
															</TooltipTrigger>
															<TooltipContent>
																Return Asset
															</TooltipContent>
														</Tooltip>
													)}

												</div>
											</div>
											<div className="flex flex-col gap-1">
												<p className="text-sm leading-relaxed text-slate-600">{`Assigned Remarks: ${u.assignRemarks || '-'}`}</p>
												<p className="text-sm leading-relaxed text-slate-600">{`Returned Remarks: ${u.returnRemarks || '-'}`}</p>
											</div>
											<p className="mt-2 flex items-center gap-1 text-[11px] text-slate-400">
												<Clock size={11} />
												Duration: {months} months {days} days {isCurrent ? "(continues)" : ""}
											</p>
										</div>
									</div>
								);
							})
						) : (
							<div className="relative space-y-6 pl-6 text-sm text-slate-400">No matching results</div>
						)}
					</TimelineWrap>
				</ScrollArea>
			) : (
				<div className="relative space-y-6 pl-6 text-sm text-slate-400">No user yet</div>
			)
			}

			<CreateAssetAssignDialog
				open={assignOpen}
				onOpenChange={setAssignOpen}
				assetTag={asset.assetTag}
			/>

			<EditAssetAssignmentDialog
				open={!!editTarget}
				onOpenChange={(open) => !open && setEditTarget(null)}
				assignment={editTarget}
				onSuccess={() => {
					setEditTarget(null);
					if (onChanged) {
						onChanged();
					} else {
						window.location.reload();
					}
				}}
			/>

			<ReturnAssetDialog
				open={!!returnTarget}
				onOpenChange={(open) => !open && setReturnTarget(null)}
				assignmentId={returnTarget?.id ?? 0}
				onSuccess={() => {
					setReturnTarget(null);
					onChanged?.();
				}}
			/>

			<GeneratePdfDialog
				key={generateTarget?.id}
				open={openGenerateDialog}
				onOpenChange={(open) => setOpenGenerateDialog(open)}
				data={generateTarget}
				type={type}
			/>

			<UploadBastAssignmentDialog
				open={!!uploadTarget}
				onOpenChange={(open) => !open && setUploadTarget(null)}
				assignmentId={uploadTarget?.id ?? 0}
				employeeName={uploadTarget?.employeeName}
				onSuccess={() => {
					setUploadTarget(null);
					onChanged?.();
				}}
			/>

		</div >
	);
}


export const AssetAssignmentTimelineAsset = ({ assetAssignments, maxHeight = "420px" }: {
	assetAssignments: IDetailAssetAssignment[] | undefined;
	maxHeight?: string;
}) => {
	const [searchQuery, setSearchQuery] = useState("");

	const filteredAssignments = assetAssignments?.filter((assignment) => {
		if (!searchQuery) return true;
		const query = searchQuery.toLowerCase();
		return (
			assignment.asset.assetTag.toLowerCase().includes(query) ||
			assignment.userNonEmployeeName?.toLowerCase().includes(query) ||
			assignment.remarks?.toLowerCase().includes(query)
		);
	});

	if (!assetAssignments || assetAssignments.length === 0) {
		return <div className="relative space-y-6 pl-6 text-sm text-slate-400">No user yet</div>;
	}

	return (
		<div className="flex flex-col gap-3">
			<InputGroup className="mb-4">
				<InputGroupInput
					placeholder="Search by asset tag, user name..."
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
				/>
				<InputGroupAddon>
					<Search />
				</InputGroupAddon>
			</InputGroup>

			<ScrollArea style={{ height: maxHeight }} className="pr-4">
				<TimelineWrap>
					{filteredAssignments && filteredAssignments.length > 0 ? (
						filteredAssignments.map((u) => {
							const isCurrent = !u.returnedAt;
							const { months, days } = monthsDaysBetween(u.assignedAt, u.returnedAt || new Date().toDateString());
							return (
								<div key={u.id} className="relative">
									<span
										className={`absolute -left-6 top-1 h-3 w-3 rounded-full border-2 bg-white ${isCurrent ? "border-emerald-500" : "border-slate-300"
											}`}
									/>
									<div className="flex items-baseline justify-between gap-2">
										<div className="flex gap-1 flex-col">
											<div className="flex items-center gap-2">
												<Link
													to={`/assets/${u.asset.assetTag}`}
													className="font-semibold text-ptba-text cursor-pointer hover:underline"
												>
													{u.asset.assetTag}
												</Link>
											</div>
										</div>
										<p className="whitespace-nowrap text-xs text-slate-400">
											{fmtDate(u.assignedAt)} → {!u.returnedAt ? "now" : fmtDate(u.returnedAt)}
										</p>
									</div>

									<div
										className={`mt-2 rounded-lg border p-3.5 ${isCurrent ? "bg-emerald-50/40 border-emerald-100" : "bg-slate-50 border-slate-100"
											}`}
									>
										<div className="mb-2 flex flex-wrap items-center gap-2">
											<Badge
												variant="outline"
												className={`rounded-full text-[11px] font-semibold uppercase tracking-wider ${isCurrent
													? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50"
													: "bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-100"
													}`}
											>
												{isCurrent ? "In Use" : "Returned"}
											</Badge>
											{u.userNonEmployeeName && (
												<Badge variant="outline" className="text-[11px] font-normal text-slate-500">
													User: {u.userNonEmployeeName}
												</Badge>
											)}
										</div>
										<p className="text-sm leading-relaxed text-slate-600">{u.remarks || "-"}</p>
										<p className="mt-2 flex items-center gap-1 text-[11px] text-slate-400">
											<Clock size={11} />
											Duration: {months} bulan {days} hari {isCurrent ? "(berjalan)" : ""}
										</p>
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