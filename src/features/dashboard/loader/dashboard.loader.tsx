import {TicketRepository} from "../../../data/repositories/ticket.repository.ts";
import {AssetRepository} from "../../../data/repositories/asset.repository.ts";


const getTicketSummary = async () => {
    return await TicketRepository.getTicketSummary()
}

const getTicketTrend = async () => {
    return await TicketRepository.getTicketTrend()
}

const getAssetSummary = async () => {
    const data = await AssetRepository.getAssetSummary();
    return data
}


export const dashboardLoader = async ()  => {
    const [ticketSummary, ticketTrend, assetSummary] = await Promise.all([getTicketSummary(), getTicketTrend(), getAssetSummary()])
    return {
	ticketSummary,
	ticketTrend,
	assetSummary
    }
}