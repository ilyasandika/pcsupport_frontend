import type {ITicket, ITicketRepository, ITicketStatusResponse, ITicketSummary} from "../../types/ticket.type.ts";
import ticketDummy from '../local/ticket/ticket.data.json'
import ticketSummaryDummy from '../local/ticket/ticket-summary.data.json'
import type {IChartData} from "../../types/common.type.ts";
import ticketTren from "../local/ticket/ticket-tren.data.json"
import {delay} from "../../helper/helper.tsx";
import api from "../api/interceptors.ts";
import type {ICreateTicketDto} from "@/features/ticket/dto/create-ticket.dto.ts";
import type {AxiosResponse} from "axios";

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
    },
    createTicket: async (ticket: ICreateTicketDto) => {
	console.log(ticket)
    },
    printTicket: async (id: number) => {
	return await api.get(`/tickets/${id}/pdf`)
    }
}

const ticketApi: ITicketRepository = {
    getAllTickets: async (): Promise<ITicket[]> => {
	const res = await api.get('/tickets')
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
	const res = await api.get(`/tickets/${id}`)
	return res.data.data;
    },

    createTicket: async (ticket: ICreateTicketDto) => {
	const res = await api.post('/tickets', ticket)
	return res.data.data;
    },

    printTicket: async (id: number) => {
	const res: AxiosResponse = await api.get(`/tickets/${id}/pdf`, {
	    responseType: 'blob'
	})

	const blob = new Blob([res.data], { type: 'application/pdf' });
	const blobUrl = URL.createObjectURL(blob);

	window.open(blobUrl, '_blank');
    }
}

export const createTicketRepository = () => {
    const dataMode = import.meta.env.VITE_DATA_MODE || 'local';
    return dataMode === 'api' ? ticketApi : ticketLocal;
};

export const TicketRepository = createTicketRepository();
