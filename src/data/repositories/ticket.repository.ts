import type {ITicket, ITicketRepository, ITicketSummary} from "../../types/ticket.type.ts";
import ticketDummy from '../local/ticket/ticket.data.json'
import ticketSummaryDummy from '../local/ticket/ticket-summary.data.json'
import type {IChartData} from "../../types/common.type.ts";
import ticketTren from "../local/ticket/ticket-tren.data.json"
import {delay} from "../../helper/helper.tsx";

const ticketLocal: ITicketRepository = {
    getAllTickets: async (): Promise<ITicket[]> => {
	await delay();
	return ticketDummy as ITicket[];
    },
    getTicketSummary: async (): Promise<ITicketSummary> => {
	await delay();
	return ticketSummaryDummy as ITicketSummary;
    },
    getTicketTrend: async (): Promise<IChartData[]> => {
	await delay();
	return ticketTren as IChartData[];
    }
}

const ticketApi: ITicketRepository = {
    getAllTickets: async (): Promise<ITicket[]> => {
	return [];
    },
    getTicketSummary: async (): Promise<ITicketSummary> => {
	return {} as ITicketSummary;
    },
    getTicketTrend: async (): Promise<IChartData[]> => {
	return [] as IChartData[];
    }
}

export const createTicketRepository = () => {
    const dataMode = import.meta.env.VITE_DATA_MODE || 'local';
    return dataMode === 'api' ? ticketApi : ticketLocal;
};

export const TicketRepository = createTicketRepository();
