import {getProgressStyle, getSlaStyleByDuration, getStatusBadgeStyle} from "@/helper/style-helper.tsx";
import {
    calculateSlaMetric,
    capitalizeWords,
    fmtDate,
    isTicketSolved,
    type TimeHMS
} from "@/helper/helper.tsx";
import {useLoaderData, useNavigate} from "react-router";
import type {ITicket} from "@/types/ticket.type.ts";
import {Item, ItemContent, ItemHeader, ItemMedia, ItemTitle} from "@/components/ui/item";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {
    AlarmClock,
    BriefcaseBusiness,
    Building2,
    ClockAlert, FilePlusCorner, Printer, SquarePen,
    SquareUserRound,
    UserCheck,
    UserKey
} from "lucide-react";
import {DetailCard, DetailCardRow, DetailCardItem} from "@/components/detail-card.tsx";
import {Progress} from "@/components/ui/progress";
import {Badge} from "@/components/ui/badge";
import {ButtonGroup} from "@/components/ui/button-group";
import {AlertDialogContainer} from "@/components/alert-dialog-container.tsx";
import {useState} from "react";
import {GeneratePdfDialog} from "@/features/user/components/generate-pdf-dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useAuth} from "@/context/AuthContext.tsx";
import {BackButton} from "@/components/back-button";
import {useResourceAccess} from "@/hooks/use-resource-access.ts";
import {useClaimTicket} from "@/features/ticket/hooks/use-claim-ticket.ts";
import {useApproveTicket} from "@/features/ticket/hooks/use-approve-ticket.ts";

export const TicketDetailPage = () => {

    const navigate = useNavigate()
    const {isSupervisor, isAdmin, isEngineer} = useAuth()
    const {canAccess} = useResourceAccess()
    const ticket = useLoaderData<ITicket>()
    const slaStyle = getSlaStyleByDuration(ticket.slaPolicy.resolutionTimeSeconds)
    const [openGeneratePdfDialog, setOpenGeneratePdfDialog] = useState<boolean>(false)

    const responseMetric = calculateSlaMetric(
	ticket.createdAt,
	ticket.startAt || new Date().toISOString(),
	ticket.slaPolicy.responseTimeSeconds
    );

    let resolutionMetric: { actual: TimeHMS, target: TimeHMS, percentage: number } | undefined;
    resolutionMetric = calculateSlaMetric(
	ticket.startAt || new Date().toISOString(),
	ticket.solvedAt || new Date().toISOString(),
	ticket.slaPolicy.resolutionTimeSeconds
    );


    const [claimDialogOpen, setClaimDialogOpen] = useState<boolean>(false)
    const [approveDialogOpen, setApproveDialogOpen] = useState<boolean>(false)

    const {mutate: claimTicket } = useClaimTicket()
    const {mutate: approveTicket, isPending: isApproveTicketPending} = useApproveTicket()

    return (
	<div className="max-w-7xl mx-auto space-y-6">
	    <div className="flex items-center justify-between">
		<BackButton/>
		<ButtonGroup aria-label="Button group" className="w-full justify-end">
		    {
			isSupervisor() && (
			    <Button
				variant={ticket.approvedBy ? "outline" : "default"}
				className={ticket.approvedBy ? "" : "bg-emerald-600 hover:bg-emerald-700 text-white"}
				disabled={Boolean(ticket.approvedBy) || isApproveTicketPending}
				onClick={() => setApproveDialogOpen(true)}
			    >
				<UserCheck className="size-4 mr-1.5"/>
				{ticket.approvedBy ? `Approved by ${ticket.approvedBy.fullName || 'Supervisor'}` : "Approve Ticket"}
			    </Button>
			)
		    }
		    {
			isTicketSolved(ticket.status) &&

                        <Button variant="outline" onClick={() => setOpenGeneratePdfDialog(true)}>
                            <Printer/> Generate BAST
                        </Button>
		    }
		    {
			canAccess({resourceOwnerId: ticket.engineer?.id, bypassRoles: ['admin', 'helpdesk']}) && (
			    <Button variant="outline" onClick={() => navigate(`/tickets/${ticket.id}/update`)}>
				<SquarePen/> Edit Ticket
			    </Button>
			)
		    }
		    {
			(!ticket.engineer && (isAdmin() || isEngineer())) &&
                        <Button variant="outline" onClick={() => setClaimDialogOpen(true)}>
                            <FilePlusCorner/> Claim Ticket
                        </Button>
		    }
		</ButtonGroup>
	    </div>

	    <Card className="">
		<CardContent>
		    <div className="flex items-center gap-4 justify-between">
			<h1 className="text-2xl font-bold ">Ticket No. {ticket.fullNumber ?? '-'}</h1>
			<Badge className={`${getStatusBadgeStyle(ticket.status)} p-3 uppercase`}>
			    {ticket.status}
			</Badge>
		    </div>
		</CardContent>
	    </Card>

	    {/* --- 2. FULL-WIDTH SLA & TIMELINE BANNER --- */}
	    <Card className="pt-0">
		<CardHeader className="p-0">
		    <CardTitle
			className={`${slaStyle.header} ${slaStyle.accentText} py-2 px-4 flex items-center justify-between`}>
			<Item className="text-xs font-bold uppercase tracking-wider p-0 flex items-center">
			    <ItemMedia className="">
				<AlarmClock className="w-4 h-4"/>
			    </ItemMedia>
			    <ItemContent className="flex flex-row gap-2 ">
				<span>SLA Policy:</span>
				<span
				    className={`${slaStyle.accentText} normal-case font-semibold`}>{ticket.slaPolicy.name}</span>
			    </ItemContent>
			</Item>

			{ticket.slaPolicy.isBusinessHourOnly ?
			    <Badge className={`${slaStyle.hourType}`}>
				<BriefcaseBusiness className={"w-4 h-4"} data-icon="inline-start"/>
				Business Hour Only
			    </Badge>
			    :
			    <Badge className={`${slaStyle.hourType}`}>
				<ClockAlert className={"w-4 h-4"} data-icon="inline-start"/>
				24/7 Support
			    </Badge>
			}
		    </CardTitle>
		</CardHeader>

		{/* Main Comparison Grid */}
		<CardContent className="grid grid-cols-1 md:grid-cols-1   gap-6 ">

		    {/* Left Side: SLA Targets */}
		    <div className="flex flex-col space-y-3">
			<div className="grid grid-cols-2 gap-4 flex-1">
			    <Item className="bg-secondary gap-2">
				<ItemHeader className="">
				    <ItemTitle className="text-slate-500 font-normal text-xs">Response time</ItemTitle>
				</ItemHeader>
				<ItemContent className="flex flex-col gap-1">
				    {ticket.startAt ?
					<p className="text-xl font-bold">{`${responseMetric.actual.hours} Hours ${responseMetric.actual.minutes} Minutes`}</p>
					:
					'-'
				    }
				    <p className="text-slate-500 text-xs">Target {responseMetric.target.hours} Hours {responseMetric.target.minutes} Minutes</p>
				    <Progress value={responseMetric.percentage}
					      className={getProgressStyle(responseMetric.percentage)}/>
				    <div className="text-xs flex flex-row justify-between text-slate-500">
					<span>Created: {fmtDate(ticket.createdAt)}</span>
					<span>Started: {ticket.startAt ? fmtDate(ticket.startAt) : "-"}</span>
				    </div>
				</ItemContent>
			    </Item>
			    <Item className="bg-secondary gap-2">
				<ItemHeader className="">
				    <ItemTitle className="text-slate-500 font-normal text-xs">Resolution
					Time</ItemTitle>
				    {/*<Badge className={getBadgeStyleByPercentage(resolutionMetric?.percentage || 0)}>*/}
				    {/*{`${resolutionMetric?.percentage || 0}% from target`}*/}
				    {/*</Badge>*/}
				</ItemHeader>
				<ItemContent className="flex flex-col gap-1">
				    {
					ticket.startAt ?
					    <p className="text-xl font-bold">{resolutionMetric?.actual.hours || 0} Hours {resolutionMetric?.actual.minutes} Minutes</p>
					    :
					    "-"
				    }
				    <p className="text-slate-500 text-xs">Target {resolutionMetric?.target.hours} Hours {resolutionMetric?.target.minutes} Minutes</p>
				    <Progress value={resolutionMetric?.percentage || 0}
					      className={getProgressStyle(resolutionMetric?.percentage || 0)}/>
				    <div className="text-xs flex flex-row justify-between text-slate-500">
					<span>Started: {ticket.startAt ? fmtDate(ticket.startAt) : "-"}</span>
					<span>{ticket.status === "cancelled" ? "Cancelled at:" : "Solved at:"} {ticket.solvedAt ? fmtDate(ticket.solvedAt) : "-"}</span>
				    </div>
				</ItemContent>
			    </Item>

			</div>
		    </div>
		</CardContent>
	    </Card>

	    {/* --- 3. MAIN CONTENT LAYOUT (SLA Removed from Sidebar) --- */}
	    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

		{/* LEFT COLUMN: Main Content (66%) */}
		<div className="lg:col-span-2 space-y-6">

		    <DetailCard title={"Problem"}>
			<p className="text-base leading-relaxed text-ptba-primary-navy bg-slate-50 p-4 rounded-lg border border-slate-100 whitespace-pre-wrap">
			    {ticket.problem}
			</p>
		    </DetailCard>

		    <DetailCard title={"Solution"}>
			{ticket.solution ? (
			    <p className="text-base text-ptba-primary-navy bg-ptba-tertiary-light-green/20 p-4 rounded-lg border border-green-100">{ticket.solution}</p>
			) : (
			    <p className="text-sm italic text-slate-400 bg-slate-50 p-4 rounded-lg border border-dashed border-slate-200">No
				solution yet.</p>
			)}
		    </DetailCard>

		    <DetailCard title={"Remarks"}>
			<p className="text-sm text-slate-600">{ticket.remarks ?? '-'}</p>
		    </DetailCard>


		</div>

		{/* RIGHT COLUMN: Sidebar Metadata (33%) */}
		<div className="space-y-6">

		    {/* Lokasi Kerja (Moved to top of sidebar) */}
		    <Card>
			<CardContent>
			    <DetailCardRow value={ticket.location.name} label={"Location"}/>
			</CardContent>
		    </Card>

		    {/* Requester / Employee Information */}
		    {(() => {
			const employee = ticket.employee;
			const division = ticket.snapshot?.division;

			return (
			    <DetailCard title={employee ? "Employee Information" : "User Non-Employee Information"}>
				<DetailCardItem title={'NIK'} Icon={UserKey} value={employee?.nik ?? '-'}/>
				<DetailCardItem title={'Employee Name'} Icon={SquareUserRound}
						value={employee?.name ?? '-'}/>
				<DetailCardItem title={'Position'} Icon={BriefcaseBusiness}
						value={employee?.position ?? '-'}/>
				<DetailCardItem title={'Department'} Icon={Building2}
						value={employee?.department ?? '-'}/>
				{division && <DetailCardItem title={'Division'} Icon={Building2} value={division}/>}
			    </DetailCard>
			);
		    })()}

		    {/* Created By Information */}
		    {
			ticket.createdBy &&
                        <DetailCard title={"Created By"}>
                            <DetailCardRow value={ticket.createdBy.fullName || ticket.createdBy.username}
                                           label={"Name"}/>
                            <DetailCardRow value={ticket.createdBy.role} className={"capitalize"} label={"Role"}/>
                        </DetailCard>
		    }

		    {/* Engineer Information */}
		    {
			ticket.engineer &&
                        <DetailCard title={"Engineer Information"}>
                            <DetailCardRow value={ticket.engineer?.fullName ?? '-'} label={"Name"}/>
                            <DetailCardRow value={ticket.engineer?.role ?? '-'} className={"capitalize"}
                                           label={"Role"}/>
                        </DetailCard>
		    }

		    {
			ticket.asset &&
                        <DetailCard title={"Asset Information"}>
                            <DetailCardRow value={ticket.snapshot?.userNonEmployee || ticket.employee?.name || "-"}
                                           label={"User"}/>
                            <DetailCardRow value={ticket.asset?.hostname ?? '-'} label={"Hostname"}/>
                            <DetailCardRow value={ticket.asset?.assetTag ?? '-'} label={"Asset Tag"}/>
                            <DetailCardRow value={ticket.asset?.serialNumber ?? '-'} label={"Serial Number"}/>
                            <DetailCardRow value={capitalizeWords(ticket.asset?.category.name ?? '-') || '-'}
                                           label={"Category"} className={""}/>
                        </DetailCard>
		    }
		</div>


		<AlertDialogContainer title={"Claim Ticket"}
				      description={"are you sure to claim this ticket?"}
				      open={claimDialogOpen}
				      setOpen={setClaimDialogOpen}
				      onContinue={() => claimTicket(ticket.id)}
		/>

		<AlertDialogContainer title={"Approve Ticket"}
				      description={`Are you sure you want to approve Ticket ${ticket.fullNumber}?`}
				      open={approveDialogOpen}
				      setOpen={setApproveDialogOpen}
				      onContinue={() => approveTicket(ticket.id)}
				      variant="success"
		/>

		<GeneratePdfDialog open={openGeneratePdfDialog}
				   onOpenChange={setOpenGeneratePdfDialog}
				   data={ticket}
		/>
	    </div>
	</div>
    );
}