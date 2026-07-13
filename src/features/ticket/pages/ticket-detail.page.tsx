import {
    capitalizeWords,
    dateStringToSeconds, fmtDate, getPercentage,
    getSlaStyleByDuration,
    getStatusBadgeStyle, isSolved,
    secondsToHMS
} from "@/helper/helper.tsx";
import {useLoaderData, useNavigate} from "react-router";
import type { ITicket } from "@/types/ticket.type.ts";
import {Item, ItemContent, ItemHeader, ItemMedia, ItemTitle} from "@/components/ui/item";
import { Card , CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {
    AlarmClock,
    BriefcaseBusiness,
    Building2,
    ClockAlert, FilePlusCorner, Printer, SquarePen,
    SquareUserRound,
    UserKey
} from "lucide-react";
import {DetailCard, DetailCardRow, DetailCardItem} from "@/components/detail-card.tsx";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ButtonGroup } from "@/components/ui/button-group";
import {ExpandableButton} from "@/components/expandable-button.tsx";
import {TicketRepository} from "@/data/repositories/ticket.repository.ts";
import {useLoading} from "@/context/LoadingContext.tsx";

export const TicketDetailPage = () => {

    const {isLoading, setIsLoading} = useLoading()
    const navigate = useNavigate()
    const ticket = useLoaderData<ITicket>()
    const slaStyle = getSlaStyleByDuration(ticket.slaPolicy.resolutionTimeSeconds)

    const targetResponseTime = secondsToHMS(ticket.slaPolicy.responseTimeSeconds);
    const targetResolutionTime = secondsToHMS(ticket.slaPolicy.resolutionTimeSeconds);

    const actualResponseTimeSeconds = ticket.startAt ? dateStringToSeconds(ticket.startAt) - dateStringToSeconds(ticket.createdAt): 0;
    const actualResolutionTimeSeconds = ticket.solvedAt && ticket.startAt ? dateStringToSeconds(ticket.solvedAt) - dateStringToSeconds(ticket.startAt) : 0;

    const actualResponseTime = secondsToHMS(actualResponseTimeSeconds);
    const actualResolutionTime = secondsToHMS(actualResolutionTimeSeconds);

    const actualResponseTimePercentage = getPercentage(actualResponseTimeSeconds, ticket.slaPolicy.responseTimeSeconds);
    const actualResolutionTimePercentage = getPercentage(actualResolutionTimeSeconds, ticket.slaPolicy.resolutionTimeSeconds);

    const getBadgeStyleByPercentage = (percentage: number) => {
	if (percentage >= 100) {
	 	return 'bg-ptba-primary-red/30 text-ptba-primary-red'
	}
	if (percentage >= 80) {
	    return 'bg-ptba-primary-yellow/10 text-ptba-secondary-orange'
	}
	return 'bg-ptba-tertiary-light-green/30 text-ptba-tertiary-green'
    }

    return (
	<div className="max-w-7xl mx-auto space-y-6 ">
	    {/* --- 1. HEADER SECTION --- */}
	    <ButtonGroup aria-label="Button group" className="w-full justify-end">
		{
		    isSolved(ticket.status) &&
		    <ExpandableButton
			value="Print Ticket"
			Icon={Printer}
			variant="outline"
			onClick={ () => {
			    setIsLoading(true)
			    try {
				TicketRepository.printTicket(ticket.id)
			    } catch (e) {
				console.error(e)
				setIsLoading(false)
			    } finally {
				setIsLoading(false)
			    }
			}}
			disabled={isLoading}
                    />
		}
		<ExpandableButton value="Update Ticket" Icon={SquarePen} variant="outline"/>
		{
		    !ticket.engineer &&
                    <ExpandableButton
                        value="Claim Ticket"
                        Icon={FilePlusCorner}
                        variant="outline"
                        onClick={async () => {
			    try {
				setIsLoading(true)
				TicketRepository.claimTicket(ticket.id)
				setIsLoading(false)
				navigate("/tickets")
			    } catch {
				console.log("error")
			    } finally {
				setIsLoading(false)
			    }
			}}
                    />
		}
	    </ButtonGroup>

	    <Card className="">
		<CardContent>
		    <div className="flex items-center gap-4 justify-between">
			<h1 className="text-2xl font-bold ">Ticket No. {ticket.fullNumber ?? '-'}</h1>
			<Badge className={`${getStatusBadgeStyle(ticket.status)} p-3 uppercase`} >
			    {ticket.status}
			</Badge>
		    </div>
		</CardContent>
	    </Card>

	    {/* --- 2. FULL-WIDTH SLA & TIMELINE BANNER --- */}
	    <Card className="pt-0">
	       <CardHeader className="p-0">
		   <CardTitle className={`${slaStyle.header} ${slaStyle.accentText} py-2 px-4 flex items-center justify-between`}>
			   <Item className="text-xs font-bold uppercase tracking-wider p-0 flex items-center">
			       <ItemMedia className="">
				   <AlarmClock className="w-4 h-4"/>
			       </ItemMedia>
			       <ItemContent className="flex flex-row gap-2 ">
				   <span>SLA Policy:</span>
				   <span className={`${slaStyle.accentText} normal-case font-semibold`}>{ticket.slaPolicy.name}</span>
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
				    <Badge className={getBadgeStyleByPercentage(actualResponseTimePercentage)}>
					{`${actualResponseTimePercentage}% from target`}
				    </Badge>
				</ItemHeader>
				<ItemContent className="flex flex-col gap-1">
					{ticket.startAt ?
					    <p className="text-xl font-bold">{`${actualResponseTime.hours} Hours ${actualResponseTime.minutes} Minutes`}</p>
					    :
					    '-'
					}
					<p className="text-slate-500 text-xs">Target {targetResponseTime.hours} Hours {targetResponseTime.minutes} Minutes</p>
					<Progress value={actualResponseTimePercentage} className={'*:bg-ptba-tertiary-light-green'}/>
					<div className="text-xs flex flex-row justify-between text-slate-500">
					    <span>Created: {fmtDate(ticket.createdAt)}</span>
					    <span>Started: {ticket.startAt ? fmtDate(ticket.startAt) : "-"}</span>
					</div>
				</ItemContent>
			    </Item>
			    <Item className="bg-secondary gap-2">
				<ItemHeader className="">
				    <ItemTitle className="text-slate-500 font-normal text-xs">Resolution Time</ItemTitle>
				    <Badge className={getBadgeStyleByPercentage(actualResolutionTimePercentage)}>
					{`${actualResolutionTimePercentage}% from target`}
				    </Badge>
				</ItemHeader>
				<ItemContent className="flex flex-col gap-1">
				    <p className="text-xl font-bold">{actualResolutionTime.hours} Hours {actualResolutionTime.minutes} Minutes</p>
				    <p className="text-slate-500 text-xs">Target {targetResolutionTime.hours} Hours {targetResolutionTime.minutes} Minutes</p>
				    <Progress value={actualResolutionTimePercentage} className={'*:bg-ptba-tertiary-light-green'}/>
				    <div className="text-xs flex flex-row justify-between text-slate-500">
					<span>Started: {ticket.startAt ? fmtDate(ticket.startAt) : "-"}</span>
					<span>Solved: {ticket.solvedAt ? fmtDate(ticket.solvedAt) : "-"}</span>
				    </div>
				</ItemContent>
			    </Item>

			</div>
		    </div>

		    {/* Right Side: Actual Execution Timeline */}
		    {/*<div className="flex flex-col space-y-3 pt-4 md:pt-0 md:pl-6">*/}
		    {/*    <h3 className="text-xs  font-bold  uppercase tracking-wider">Actual Timeline</h3>*/}
		    {/*    /!* h-full SUDAH DIHAPUS, diganti flex-1 agar tingginya presisi mengikuti parent tanpa meluber *!/*/}
		    {/*    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1">*/}
		    {/*	<div className="bg-blue-50/40 p-2.5 rounded-lg border border-blue-100 flex flex-col justify-center">*/}
		    {/*	    <p className="text-[11px] font-medium text-blue-600">Created</p>*/}
		    {/*	    <p className="text-xs font-semibold text-slate-700 mt-0.5 leading-tight">{new Date(ticket.createdAt).toLocaleString('id-ID')}</p>*/}
		    {/*	</div>*/}
		    {/*	<div className="bg-amber-50/40 p-2.5 rounded-lg border border-amber-100 flex flex-col justify-center">*/}
		    {/*	    <p className="text-[11px] font-medium text-amber-700">Started</p>*/}
		    {/*	    <p className="text-xs font-semibold text-slate-700 mt-0.5 leading-tight">*/}
		    {/*		{ticket.startAt ? new Date(ticket.startAt).toLocaleString('id-ID') : <span className="text-slate-400 italic font-normal">Not started</span>}*/}
		    {/*	    </p>*/}
		    {/*	</div>*/}
		    {/*	/!* Mengganti warna merah menyala dengan green-50 agar senada jika solved / status normal *!/*/}
		    {/*	<div className="bg-green-50/40 p-2.5 rounded-lg border border-green-100 flex flex-col justify-center">*/}
		    {/*	    <p className="text-[11px] font-medium text-green-700">Solved</p>*/}
		    {/*	    <p className="text-xs font-semibold text-slate-700 mt-0.5 leading-tight">*/}
		    {/*		{ticket.solvedAt ? new Date(ticket.solvedAt).toLocaleString('id-ID') : <span className="text-slate-400 italic font-normal">Not solved</span>}*/}
		    {/*	    </p>*/}
		    {/*	</div>*/}

		    {/*    </div>*/}
		    {/*</div>*/}

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
			    <p className="text-sm italic text-slate-400 bg-slate-50 p-4 rounded-lg border border-dashed border-slate-200">No solution yet.</p>
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

		    <DetailCard title={"Employee Information"}>
			<DetailCardItem title={'NIK'} Icon={UserKey} value={ticket.employee?.nik ?? '-'} />
			<DetailCardItem title={'Nama'} Icon={SquareUserRound} value={ticket.employee?.name ?? '-'} />
			<DetailCardItem title={'Position'} Icon={BriefcaseBusiness} value={ticket.employee?.position ?? '-'} />
			<DetailCardItem title={'Department'} Icon={Building2} value={ticket.employee?.department ?? '-'} />
		    </DetailCard>

		    {/* Engineer Information */}
		    {
			ticket.engineer &&
			<DetailCard title={"Engineer Information"} >
			    <DetailCardRow value={ticket.engineer?.fullName ?? '-'} label={"Name"}/>
			    <DetailCardRow value={ticket.engineer?.role ?? '-'} className={"capitalize"} label={"Role"}/>
			</DetailCard>
		    }

		    {
			ticket.asset &&
			<DetailCard title={"Asset Information"} >
			    <DetailCardRow value={ticket.asset?.hostname ?? '-'} label={"Hostname"}/>
			    <DetailCardRow value={ticket.asset?.assetTag ?? '-'} label={"Asset Tag"}/>
			    <DetailCardRow value={ticket.asset?.serialNumber ?? '-'} label={"Serial Number"}/>
			    <DetailCardRow value={capitalizeWords(ticket.asset?.category.name ?? '-') || '-'} label={"Category"} className={""}/>
			</DetailCard>
		    }
		</div>
	    </div>
	</div>
    );
}