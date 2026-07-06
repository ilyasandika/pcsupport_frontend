import {AlertCircle, CheckCircle2, Clock} from "lucide-react";
import {TicketCard} from "../components/ticket-card.tsx";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

import {useLoaderData} from "react-router";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card.tsx";


export const DashboardPage = () => {
    const {ticketSummary, ticketTrend, assetSummary} = useLoaderData()
    console.log(assetSummary)
    return (
	<div className="flex-1 space-y-6 lg:space-y-8 overflow-auto">
	    {/*hero*/}

	    <Card className="bg-ptba-primary">
		<CardHeader>
		    <CardTitle className="text-white text-xl font-bold sm:text-2xl">Tickets Overview</CardTitle>
		    <CardDescription className="text-ptba-subtext-dark">Latest ticket activity</CardDescription>
		</CardHeader>
		<CardContent>
		    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 text-white">
			<TicketCard label="Total Ticket" value={ticketSummary?.total || 0} status={'total'} Icon={AlertCircle}/>
			<TicketCard label="Open Ticket" value={ticketSummary?.open || 0} status={'open'} Icon={Clock}/>
			<TicketCard label="Ticket on Progress" value={ticketSummary?.onProgress || 0} status={'progress'} Icon={AlertCircle}/>
			<TicketCard label="Closed Ticket" value={ticketSummary?.closed || 0} status={'closed'} Icon={CheckCircle2}/>
		    </div>
		</CardContent>
	    </Card>

	    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
	    <Card>
		<CardHeader>
		    <CardTitle>Ticket Trend</CardTitle>
		    <CardDescription>Weekly ticket volume overview</CardDescription>
		</CardHeader>
		<CardContent>
		    <ResponsiveContainer width="100%" height={240}>
			<LineChart data={ticketTrend}>
			    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
			    <XAxis dataKey="label" stroke="#9ca3af" style={{ fontSize: '12px' }} />
			    <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
			    <Tooltip
				contentStyle={{
				    backgroundColor: 'white',
				    border: '1px solid #e5e7eb',
				    borderRadius: '8px',
				    fontSize: '12px'
				}}
			    />
			    <Line
				type="monotone"
				dataKey="count"
				stroke="#344689"
				strokeWidth={3}
				dot={{ fill: '#344689', r: 5 }}
				activeDot={{ r: 7 }}
			    />
			</LineChart>
		    </ResponsiveContainer>
		</CardContent>
	    </Card>

	    <Card>
		<CardHeader>
		    <CardTitle>Asset Distribution</CardTitle>
		    <CardDescription>Current inventory by category</CardDescription>
		</CardHeader>
		<CardContent>
		    <ResponsiveContainer width="100%" height={240}>
			<BarChart data={assetSummary}>
			    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
			    <XAxis dataKey="label" stroke="#9ca3af" style={{ fontSize: '12px' }} />
			    <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
			    <Tooltip
				contentStyle={{
				    backgroundColor: 'white',
				    border: '1px solid #e5e7eb',
				    borderRadius: '8px',
				    fontSize: '12px'
				}}
			    />
			    <Bar dataKey="count" fill="#344689" radius={[8, 8, 0, 0]} />
			</BarChart>
		    </ResponsiveContainer>
		</CardContent>
	    </Card>
	    </div>

	</div>


    )
}

