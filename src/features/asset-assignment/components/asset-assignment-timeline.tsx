import {useState} from "react";
import {ScrollArea, ScrollBar} from "@/components/ui/scroll-area";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {
    UserPlus,
    Undo2,
    Clock,
    FilePlusCorner,
    FileSearchCorner,
    FileCog,
    Search,
    Pencil,
    Trash2,
    EllipsisVertical, FileXCorner
} from "lucide-react";
import {TimelineWrap} from "@/components/timeline-wrap.tsx";
import {fmtDate, monthsDaysBetween} from "@/helper/helper.tsx";
import type {IDetailAssetAssignment} from "@/types/asset-assignment.type.ts";
import {Link, useNavigate} from "react-router";
import {ReturnAssetDialog} from "@/features/asset-assignment/components/return-asset-assignment-dialog.tsx";
import {CreateAssetAssignDialog} from "@/features/asset-assignment/components/asset-assignment-dialog.tsx";
import {EditAssetAssignmentDialog} from "@/features/asset-assignment/components/edit-asset-assignment-dialog.tsx";
import {InputGroup, InputGroupAddon, InputGroupInput} from "@/components/ui/input-group";
import {
    UploadBastAssignmentDialog
} from "@/features/asset-assignment/components/upload-bast-assignment-dialog.tsx";
import {AssetAssignmentRepository} from "@/data/repositories/asset-assignment.repository.ts";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import {GeneratePdfDialog} from "@/features/user/components/generate-pdf-dialog.tsx";
import {AssetStatus, type IDetailAsset} from "@/types/asset.type.ts";
import {DialogContainer} from "@/components/dialog-container.tsx";
import {useDeleteAssignment} from "@/features/asset-assignment/hooks/use-delete-assignment.ts";
import {useDeleteDocument} from "@/features/asset-assignment/hooks/use-delete-document.ts";


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
    const [deleteTarget, setDeleteTarget] = useState<IDetailAssetAssignment | null>(null);
    const [deleteDocumentTarget, setDeleteDocumentTarget] = useState<{assignment: IDetailAssetAssignment, type: "assign" | "return"} | null>(null);


    const {mutateAsync: deleteAssignment} = useDeleteAssignment()
    const {mutateAsync: deleteDocument} = useDeleteDocument()

    const [generateTarget, setGenerateTarget] = useState<IDetailAssetAssignment>({} as IDetailAssetAssignment);
    const [type, setType] = useState<'assign' | 'return'>('assign');
    const [openGenerateDialog, setOpenGenerateDialog] = useState<boolean>(false);

    const [uploadTarget, setUploadTarget] = useState<{
	id: number;
	employeeName?: string;
	type: 'assign' | 'return'
    } | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const activeAssignment = assetAssignments?.find((a) => !a.returnedAt);
    const allowedStatus = [
	AssetStatus.Backup,
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
			<Search/>
		    </InputGroupAddon>
		</InputGroup>

		<Tooltip open={allowedToAssign() ? false : undefined}>
		    <TooltipTrigger asChild>
			<Button
			    size="sm"
			    onClick={() => setAssignOpen(true)}
			    disabled={!!activeAssignment || !allowedToAssign()}
			>
			    <UserPlus className="size-4 mr-1.5"/>
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
		<ScrollArea style={{height: maxHeight}} className="pr-4">
		    <TimelineWrap>
			{filteredAssignments && filteredAssignments.length > 0 ? (
			    filteredAssignments.map((u) => {
				const isCurrent = !Boolean(u.returnedAt);
				const {
				    months,
				    days
				} = monthsDaysBetween(u.assignedAt, u.returnedAt || new Date().toDateString());

				const isFileUploaded = isCurrent
				    ? Boolean(u.assignFilePath)
				    : (Boolean(u.assignFilePath) && Boolean(u.returnFilePath));

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
						    <Badge variant="outline"
							   className="text-[11px] font-normal text-slate-500">
							NIK {u.employee.nik}
						    </Badge>
						    {u.userNonEmployeeName && (
							<Badge variant="outline"
							       className="text-[11px] font-normal text-slate-500">
							    User: {u.userNonEmployeeName}
							</Badge>
						    )}
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
							{
							    u.isLegacyData &&
                                                            <Badge variant="outline"
                                                                   className={`text-[11px] font-normal bg-ptba-primary-yellow/30 text-ptba-primary-red`}>
                                                                LEGACY
                                                            </Badge>
							}

							<Badge variant="outline"
							       className={`text-[11px] font-normal ${u.assignFilePath ? 'bg-ptba-tertiary-light-green/30 text-ptba-tertiary-green' : 'bg-ptba-primary-yellow/30 text-ptba-secondary-orange'}`}>
							    {u.assignFilePath ? 'Done BAST Assign' : 'Pending BAST Assign'}
							</Badge>

							{u.returnFilePath ? (
							    <Badge variant="outline"
								   className="text-[11px] font-normal bg-ptba-tertiary-light-green/30 text-ptba-tertiary-green">
								Done BAST Return
							    </Badge>
							) : u.returnedAt ? (
							    <Badge variant="outline"
								   className="text-[11px] font-normal bg-ptba-primary-yellow/30 text-ptba-secondary-orange">
								Pending BAST Return
							    </Badge>
							) : null}
						    </div>
						    <ScrollBar orientation="horizontal" hidden/>
						</ScrollArea>
						<div className="flex flex-row gap-2 items-center">
						    {
							!isFileUploaded &&
                                                        <DropdownMenu>
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <DropdownMenuTrigger asChild>
                                                                        <Button variant="outline" size="sm">
                                                                            <FileCog className="size-4"/>
                                                                        </Button>
                                                                    </DropdownMenuTrigger>
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    Generate BAST
                                                                </TooltipContent>
                                                            </Tooltip>
                                                            <DropdownMenuContent>
								{ !u.assignFilePath &&
                                                                    <DropdownMenuItem onClick={() => {
									setOpenGenerateDialog(true)
									setGenerateTarget(u)
									setType('assign')
								    }}>
                                                                        BAST Assign
                                                                    </DropdownMenuItem>
								}
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
						    }
						    {
							!isFileUploaded &&
                                                        <DropdownMenu>
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <DropdownMenuTrigger asChild>
                                                                        <Button variant="outline" size="sm">
                                                                            <FilePlusCorner className="size-4"/>
                                                                        </Button>
                                                                    </DropdownMenuTrigger>
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    Upload BAST
                                                                </TooltipContent>
                                                            </Tooltip>
                                                            <DropdownMenuContent>
								{
								    !u.assignFilePath &&
                                                                    <DropdownMenuItem onClick={() => setUploadTarget({
									id: u.id,
									employeeName: u.employee.name,
									type: 'assign'
								    })}>
                                                                        BAST Assign
                                                                    </DropdownMenuItem>
								}
								{(!isCurrent && !u.returnFilePath) && (
								    <DropdownMenuItem onClick={() => setUploadTarget({
									id: u.id,
									employeeName: u.employee.name,
									type: 'return'
								    })}>
									BAST Return
								    </DropdownMenuItem>
								)}
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
						    }


						    {
							(u.assignFilePath || u.returnFilePath) && (
							    <DropdownMenu>
								<Tooltip>
								    <DropdownMenuTrigger asChild>
									<TooltipTrigger asChild>
									    <Button variant="outline" size="sm">
										<FileSearchCorner className="size-4"/>
									    </Button>
									</TooltipTrigger>
								    </DropdownMenuTrigger>
								    <TooltipContent>
									Detail BAST
								    </TooltipContent>
								</Tooltip>

								<DropdownMenuContent>
								    {
									u.assignFilePath &&
                                                                        <DropdownMenuItem
                                                                            onClick={() => AssetAssignmentRepository.viewDocument(u.id, "assign")}>
                                                                            BAST Assign
                                                                        </DropdownMenuItem>
								    }
								    { (!isCurrent && u.returnFilePath) && (
									<DropdownMenuItem
									    onClick={() => AssetAssignmentRepository.viewDocument(u.id, "return")}>
									    BAST Return
									</DropdownMenuItem>
								    )}
								</DropdownMenuContent>
							    </DropdownMenu>
							)
						    }

						    {
							(u.assignFilePath || u.returnFilePath) && (
							    <DropdownMenu>
								<Tooltip>
								    <DropdownMenuTrigger asChild>
									<TooltipTrigger asChild>
									    <Button variant="outline" size="sm">
										<FileXCorner className="size-4 text-ptba-primary-red"/>
									    </Button>
									</TooltipTrigger>
								    </DropdownMenuTrigger>
								    <TooltipContent>
									Delete BAST
								    </TooltipContent>
								</Tooltip>

								<DropdownMenuContent>
								    {
									u.assignFilePath &&
                                                                        <DropdownMenuItem
                                                                            onClick={() => setDeleteDocumentTarget({assignment: u, type: "assign"})}>
                                                                            BAST Assign
                                                                        </DropdownMenuItem>
								    }
								    { (!isCurrent && u.returnFilePath) && (
									<DropdownMenuItem
									    onClick={() => setDeleteDocumentTarget({assignment: u, type: "return"})}>
									    BAST Return
									</DropdownMenuItem>
								    )}
								</DropdownMenuContent>
							    </DropdownMenu>
							)
						    }


						    <DropdownMenu>
							<DropdownMenuTrigger asChild>
							    <Button variant="outline" size="sm">
								<EllipsisVertical/>
							    </Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align={"end"}
									     className={"flex flex-col gap-2 items-start w-full"}>

							    <Button
								variant="outline"
								size="sm"
								className="w-full"
								onClick={() => setReturnTarget({
									id: u.id,
									employeeName: u.employee.name
								})}
								disabled={!isCurrent}
							    >
								Return Asset
								<Undo2 data-icon={"inline-end"}/>
							    </Button>

							    <Button
								variant="outline"
								size="sm"
								className="w-full"
								onClick={() => setEditTarget(u)}
							    >
								Edit Assignment
								<Pencil data-icon={"inline-end"}/>
							    </Button>
							    <Tooltip>
								<TooltipTrigger asChild>
								<span>
								    <Button
									variant="outline"
									size="sm"
									className="w-full text-red-500 hover:text-red-600 hover:bg-red-50"
									onClick={() => setDeleteTarget(u)}
									disabled={!isCurrent}
								    >
									Delete Assignment
									<Trash2/>
								    </Button>
								</span>
								</TooltipTrigger>
								<TooltipContent hidden={isCurrent}>
								    {!isCurrent && "Cannot delete returned assignment"}
								</TooltipContent>
							    </Tooltip>
							</DropdownMenuContent>
						    </DropdownMenu>

						</div>
					    </div>
					    <div className="flex flex-col gap-1">
						<p className="text-sm leading-relaxed text-slate-600">{`Assigned Remarks: ${u.assignRemarks || '-'}`}</p>
						<Link to={`/tickets/${u.assignTicket?.id}`} className="text-sm leading-relaxed text-slate-600" onClick={(e) => {if (!u.assignTicket) e.preventDefault()}}>{`Assigned Ticket/WO No. : ${u.assignFullTicketNumber || '-'}`}</Link>
						<p className="text-sm leading-relaxed text-slate-600">{`Returned Remarks: ${u.returnRemarks || '-'}`}</p>
						<Link to={`/tickets/${u.returnTicket?.id}`} className="text-sm leading-relaxed text-slate-600" onClick={(e) => {if (!u.returnTicket) e.preventDefault()}}>{`Returned Ticket/WO No. : ${u.returnFullTicketNumber || '-'}`}</Link>
					    </div>
					    <p className="mt-2 flex items-center gap-1 text-[11px] text-slate-400">
						<Clock size={11}/>
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

	    <DialogContainer
		open={!!deleteTarget}
		setOpen={(open) => !open && setDeleteTarget(null)}
		title="Delete Assignment"
		description="Are you sure you want to delete this assignment record? This action cannot be undone."
		variant="danger"
		onContinue={() => deleteTarget && deleteAssignment({assignmentId: deleteTarget.id, assetTag: asset.assetTag})}
	    />

	    <DialogContainer
		open={!!deleteDocumentTarget}
		setOpen={(open) => !open && setDeleteDocumentTarget(null)}
		title="Delete BAST"
		description="Are you sure you want to delete this BAST PDF? This action cannot be undone."
		variant="danger"
		onContinue={() => deleteDocumentTarget && deleteDocument({assignmentId: deleteDocumentTarget.assignment.id, type: deleteDocumentTarget.type})}
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
		type={uploadTarget?.type ?? 'assign'}
	    />


	</div>
    );
}



export const AssetAssignmentTimelineAsset = ({assetAssignments, maxHeight = "420px"}: {
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
		    <Search/>
		</InputGroupAddon>
	    </InputGroup>

	    <ScrollArea style={{height: maxHeight}} className="pr-4">
		<TimelineWrap>
		    {filteredAssignments && filteredAssignments.length > 0 ? (
			filteredAssignments.map((u) => {
			    const isCurrent = !u.returnedAt;
			    const {
				months,
				days
			    } = monthsDaysBetween(u.assignedAt, u.returnedAt || new Date().toDateString());
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
						<Badge variant="outline"
						       className="text-[11px] font-normal text-slate-500">
						    User: {u.userNonEmployeeName}
						</Badge>
					    )}
					</div>
					<p className="text-sm leading-relaxed text-slate-600">{u.remarks || "-"}</p>
					<p className="mt-2 flex items-center gap-1 text-[11px] text-slate-400">
					    <Clock size={11}/>
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
	</div>
    );
};