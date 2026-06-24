import {AlertCircle, CheckCircle2, Clock, TrendingUp} from "lucide-react";
import {TicketCard} from "../components/ticket-card.tsx";
import {AssetCard} from "../components/asset-card.tsx";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

import {useLoaderData} from "react-router";


export const DashboardPage = () => {
    const {ticketSummary, ticketTrend, assetSummary, assetSummaryForChart} = useLoaderData()
    console.log(ticketSummary, ticketTrend, assetSummary, assetSummaryForChart)
    return (
	<div className="flex-1 space-y-6 lg:space-y-8 overflow-auto">
	    {/*hero*/}
	    <div className="w-full bg-ptba-primary rounded-xl lg:rounded-2xl p-6 sm:p-8 text-white shadow-lg">
		<div className="flex items-center justify-between mb-6">
		    <div>
			<h2 className="text-xl sm:text-2xl font-bold mb-2">Dashboard Overview</h2>
			<p className="text-blue-100 text-xs sm:text-sm">Real-time ticket and asset monitoring system</p>
		    </div>
		    <TrendingUp className="w-8 h-8 sm:w-12 sm:h-12 text-blue-200" />
		</div>

		{/* Ticket KPIs inside Hero Block */}
		<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
		    <TicketCard label="Total Ticket" value={ticketSummary?.total || 0} status={'total'} Icon={AlertCircle}/>
		    <TicketCard label="Open Ticket" value={ticketSummary?.open || 0} status={'open'} Icon={Clock}/>
		    <TicketCard label="Ticket on Progress" value={ticketSummary?.onProgress || 0} status={'progress'} Icon={AlertCircle}/>
		    <TicketCard label="Closed Ticket" value={ticketSummary?.closed || 0} status={'closed'} Icon={CheckCircle2}/>
		</div>
	    </div>

	    {/* Asset Management Section */}
	    <div className="bg-white rounded-xl lg:rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-200">
		<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
		    <div>
			<h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">Asset Inventory</h3>
			<p className="text-xs sm:text-sm text-gray-500">Current stock overview across all categories</p>
		    </div>
		    <button className="px-4 py-2 bg-ptba-primary text-white rounded-lg text-sm font-medium hover:bg-[#2a3670] transition-colors whitespace-nowrap">
			View Details
		    </button>
		</div>

		<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
		    <AssetCard assetType='nb' value={assetSummary?.nb || 0} />
		    <AssetCard assetType='mws' value={assetSummary?.mws || 0} />
		    <AssetCard assetType='pc' value={assetSummary?.pc || 0} />
		    <AssetCard assetType='ws' value={assetSummary?.ws || 0} />
		</div>
	    </div>

	    {/* Analytics & Statistics */}
	    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
		<div className="bg-white rounded-xl lg:rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-200">
		    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1">Ticket Trend</h3>
		    <p className="text-xs sm:text-sm text-gray-500 mb-6">Weekly ticket volume overview</p>
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
		</div>

		<div className="bg-white rounded-xl lg:rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-200">
		    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1">Asset Distribution</h3>
		    <p className="text-xs sm:text-sm text-gray-500 mb-6">Current inventory by category</p>
		    <ResponsiveContainer width="100%" height={240}>
			<BarChart data={assetSummaryForChart}>
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
		</div>
	    </div>
	</div>
    )
}

