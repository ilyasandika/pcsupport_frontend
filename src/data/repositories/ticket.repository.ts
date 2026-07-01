import type {ITicket, ITicketRepository, ITicketStatusResponse, ITicketSummary} from "../../types/ticket.type.ts";
import ticketDummy from '../local/ticket/ticket.data.json'
import ticketSummaryDummy from '../local/ticket/ticket-summary.data.json'
import type {IChartData} from "../../types/common.type.ts";
import ticketTren from "../local/ticket/ticket-tren.data.json"
import {delay} from "../../helper/helper.tsx";
import api from "../api/interceptors.ts";
import type {IResponse} from "../../types/api.type.ts";

const ticketLocal: ITicketRepository = {
    getAllTickets: async (): Promise<ITicket[]> => {
	await delay();
	return ticketDummy as unknown as ITicket[];
    },
    getTicketSummary: async (): Promise<ITicketSummary> => {
	await delay();
	return ticketSummaryDummy as unknown as ITicketSummary;
    },
    getTicketTrend: async (): Promise<IChartData[]> => {
	await delay();
	return ticketTren as unknown as IChartData[];
    },
    getTicketsByEmployeeId: async (employeeId: number): Promise<ITicket[]> => {
	await delay();
	return ticketDummy.filter(ticket => {
	    if (!ticket.user) return false;
	    return ticket.user.employeeId === employeeId;
	}) as unknown as ITicket[];
    },
    getTicketById: async (id: number): Promise<ITicket> => {
	console.log(id)
	await delay();
	return {} as ITicket;
    }
}

const ticketApi: ITicketRepository = {
    getAllTickets: async (): Promise<ITicket[]> => {
	const res = await api.get('/tickets')
	console.log(res.data)
	return res.data;
    },
    getTicketSummary: async (): Promise<ITicketSummary> => {
	const res = await api.get('tickets/count/status')
	const data: ITicketStatusResponse = res.data;
	return {
	    total: data.total,
	    open: data.open,
	    inProgress: data.inProgress,
	    closed: data.closedOnsite + data.closedRemote + data.closedVisit + data.resolved
	} as ITicketSummary
    },

    getTicketTrend: async (range: 'week' | 'month' | 'year' = "month"): Promise<IChartData[]> => {
	const data = await api.get('tickets/trend/time', {
	    params: {
		range
	    }
	})
	return data.data;
    },

    getTicketsByEmployeeId: async (employeeId: number): Promise<ITicket[]> => {
	console.log(employeeId)
	return [] as ITicket[];
    },

    getTicketById: async (id: number): Promise<ITicket> => {
	const res: IResponse<ITicket> = await api.get(`/tickets/${id}`)
	return res.data;
    }
}

export const createTicketRepository = () => {
    const dataMode = import.meta.env.VITE_DATA_MODE || 'local';
    return dataMode === 'api' ? ticketApi : ticketLocal;
};

export const TicketRepository = createTicketRepository();
