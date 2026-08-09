import type {
    IExternalTicket,
    IExternalTicketPayload,
    IExternalTicketRepository,
} from "@/types/external-ticket.type.ts";
import api from "../api/interceptors.ts";

const externalTicketApi: IExternalTicketRepository = {
    getAll: async (): Promise<IExternalTicket[]> => {
	const res = await api.get('/external-tickets');
	return res.data;
    },
    getById: async (id: number | string): Promise<IExternalTicket> => {
	const res = await api.get(`/external-tickets/${id}`);
	return res.data;
    },
    create: async (payload: IExternalTicketPayload): Promise<IExternalTicket> => {
	const res = await api.post('/external-tickets', payload);
	return res.data;
    },
    update: async (id: number | string, payload: IExternalTicketPayload): Promise<IExternalTicket> => {
	const res = await api.patch(`/external-tickets/${id}`, payload);
	return res.data;
    },
    remove: async (id: number | string) => {
	return await api.delete(`/external-tickets/${id}`);
    }
}

const createExternalTicketRepository = () => {
    return externalTicketApi
};

export const ExternalTicketRepository = createExternalTicketRepository();