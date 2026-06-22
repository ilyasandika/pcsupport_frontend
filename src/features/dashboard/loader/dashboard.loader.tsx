import {TicketRepository} from "../../../data/repositories/ticket.repository.ts";
import {AssetRepository} from "../../../data/repositories/asset.repository.ts";
import type {IChartData} from "../../../types/common.type.ts";

const getTicketSummary = async () => {
    return await TicketRepository.getTicketSummary()
}

const getTicketTrend = async () => {
    return await TicketRepository.getTicketTrend()
}

const getAssetSummary = async () => {
    const data = await AssetRepository.getAssetSummary();
    const chartData: IChartData[] = [
	{name: 'Notebooks', count: data.nb},
	{name: 'PC', count: data.pc},
	{name: 'Mobile Workstation', count: data.mws},
	{name: 'Workstation', count: data.ws},
    ]
    return {
	data,
	chartData
    };
}


export const dashboardLoader = async ()  => {
    const [ticketSummary, ticketTrend, assetSummary] = await Promise.all([getTicketSummary(), getTicketTrend(), getAssetSummary()])
    return {
	ticketSummary,
	ticketTrend,
	assetSummary: assetSummary.data,
	assetSummaryForChart: assetSummary.chartData,
    }
}