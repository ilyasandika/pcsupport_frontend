import {AlertCircle, CheckCircle2, Clock, TicketSlash} from "lucide-react";
import {TicketCard} from "../components/ticket-card.tsx";

import {useLoaderData} from "react-router";

import {ChartPieDonutText} from "@/components/charts/pie.chart.tsx";
import {useTimeSinceRefresh} from "@/hooks/use-time-since-refresh.tsx";
import {LatestTicketCard} from "@/features/dashboard/components/latest-ticket-card.tsx";
import {DashboardCardWrapper} from "@/features/dashboard/components/dashboard-card-wrapper.tsx";


export const DashboardPage = () => {
    const {ticketSummary, assetSummary, latestTicket} = useLoaderData()
    const assetSummaryData =
	assetSummary.map((asset: { label: any; count: any; }, index: number) => ({
	    label: asset.label,
	    value: asset.count,
	    color: `var(--chart-${index + 1})`,
	}));


    return (
	<div className="flex-1 space-y-6 lg:space-y-8 overflow-auto">
	    <div>
		<h1 className="font-bold text-lg">Dashboard Overview</h1>
		<span className="text-sm">{new Date().toLocaleDateString('en-UK', {
		    day: 'numeric',
		    month: 'long',
		    year: 'numeric',
		    weekday: 'long',
		})} &middot; <LastUpdateText/></span>
	    </div>

	    <div className="grid grid-cols-2 md:grid-col-3 lg:grid-cols-5 gap-4 lg:gap-6 text-white">
		<TicketCard label="Total Ticket"
			    value={ticketSummary?.total || 0}
			    status={'total'}
			    Icon={AlertCircle}
			    engineerBreakdown={ticketSummary?.byEngineer?.total}
		/>
		<TicketCard label="Open Ticket"
			    value={ticketSummary?.open || 0}
			    status={'open'}
			    Icon={Clock}
			    engineerBreakdown={ticketSummary?.byEngineer?.open}
		/>
		<TicketCard label="Ticket on Progress"
			    value={ticketSummary?.inProgress || 0}
			    status={'progress'}
			    Icon={AlertCircle}
			    engineerBreakdown={ticketSummary?.byEngineer?.inProgress}
		/>
		<TicketCard label="Closed Ticket"
			    value={ticketSummary?.closed || 0}
			    status={'closed'}
			    Icon={CheckCircle2}
			    engineerBreakdown={ticketSummary?.byEngineer?.closed}
		/>
		<TicketCard label="Cancelled Ticket"
			    value={ticketSummary?.cancelled || 0}
			    status={'cancelled'}
			    Icon={TicketSlash}
			    engineerBreakdown={ticketSummary?.byEngineer?.cancelled}
		/>
	    </div>
	    <div className="flex flex-row gap-6">
		<DashboardCardWrapper title="Latest Ticket" to="/tickets" className="w-3/4" >
		    <LatestTicketCard className="w-3/4" data={latestTicket}/>
		</DashboardCardWrapper>

		<div className="w-1/4">
		    <DashboardCardWrapper title="Asset Summary" to="/assets" className="">
			<ChartPieDonutText data={assetSummaryData} centerLabel={"Asset"}/>
		    </DashboardCardWrapper>
		</div>
	    </div>
	</div>


    )
}

export function LastUpdateText() {
    const { minutes } = useTimeSinceRefresh();
    return <>Last update {minutes} minutes ago</>;
}
