import type {
    ICreateTicketPayload,
    IEngineerCount,
    IPrintTicketPayload,
    ITicket, ITicketFilters,
    ITicketRepository,
    ITicketStatusResponse,
    ITicketSummary, IUpdateTicketPayload
} from "@/types/ticket.type.ts";
import type {IChartData} from "@/types/common.type.ts";
import api from "../api/interceptors.ts";
import type {AxiosResponse} from "axios";
import type {ISuccessResponse} from "@/types/api.type.ts";

const ticketApi: ITicketRepository = {
    getAll: async (filter?: ITicketFilters): Promise<ISuccessResponse<ITicket[]>> => {
	return await api.get('/tickets', {
	    params: filter,
	    paramsSerializer: {
		indexes: null
	    }
	})
    },
    getDashboardTickets: async (filter?: ITicketFilters): Promise<ISuccessResponse<ITicket[]>> => {
	return await api.get('/tickets/dashboard', {
	    params: filter,
	})
    },
    getTicketSummary: async (): Promise<ITicketSummary> => {
	const res = await api.get('tickets/count/status')
	const data: ITicketStatusResponse = res.data;

	const mergeEngineerCounts = (...arrays: (IEngineerCount[] | undefined)[]): IEngineerCount[] => {
	    const map = new Map<string, IEngineerCount>();
	    for (const arr of arrays) {
		if (!arr) continue;
		for (const item of arr) {
		    const key = item.engineerId ? `id_${item.engineerId}` : 'unassigned';
		    if (!map.has(key)) {
			map.set(key, { ...item });
		    } else {
			map.get(key)!.count += item.count;
		    }
		}
	    }
	    return Array.from(map.values());
	};

	return {
	    total: data.total,
	    open: data.open,
	    inProgress: data.inProgress,
	    closed: data.closedOnsite + data.closedRemote + data.closedVisit + data.resolved,
	    cancelled: data.cancelled,
	    byEngineer: {
		total: data.byEngineer?.total || [],
		open: data.byEngineer?.open || [],
		inProgress: data.byEngineer?.inProgress || [],
		closed: mergeEngineerCounts(
		    data.byEngineer?.closedRemote,
		    data.byEngineer?.closedVisit,
		    data.byEngineer?.closedOnsite,
		    data.byEngineer?.resolved,
		),
		cancelled: data.byEngineer?.cancelled || [],
	    }
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
	return res.data;
    },

    createTicket: async (ticket: ICreateTicketPayload) => {
	const res = await api.post('/tickets', ticket)
	return res.data;
    },

    updateTicket: async (id: number, ticket: IUpdateTicketPayload) => {
	const res = await api.patch(`/tickets/${id}`, ticket)
	console.log(res)
	return res.data;
    },

    generateTicketPdf: async (id: number, payload: IPrintTicketPayload): Promise<void> => {
	const res: AxiosResponse = await api.post(`/tickets/${id}/pdf`, payload, {
	    responseType: 'blob'
	})
	const blob = new Blob([res.data], { type: 'application/pdf' });
	const blobUrl = URL.createObjectURL(blob);
	window.open(blobUrl, '_blank');
    },

    claimTicket: async (ticketId: number) => {
	const res = await api.patch(`tickets/claim/${ticketId}`)
	return res.data
    },

    getSolvedTicketPdf: async (id: number) => {
	const res: AxiosResponse = await api.get(`/tickets/${id}/solved/pdf`, {
	    responseType: 'blob'
	})
	const blob = new Blob([res.data], { type: 'application/pdf' });
	const blobUrl = URL.createObjectURL(blob);

	window.open(blobUrl, '_blank');
    },
    hardRemoveTicket: async (id: number) => {
	const res = await api.delete(`/tickets/${id}/hard`)
	return res.data;
    },
    uploadTicket: async (id: number, file: File) => {
	const formData = new FormData();
	formData.append('file', file);
	const res = await api.post(`tickets/${id}/upload`, formData)
	return res.data
    }

}

export const createTicketRepository = () => {
    return ticketApi;
};

export const TicketRepository = createTicketRepository();
