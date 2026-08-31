import {delay} from "../../helper/helper.tsx";
import type {ISlaPolicy, ISlaPolicyPayload, ISlaPolicyRepository} from "@/types/sla.type.ts";
import api from "../api/interceptors.ts";

let mockSlaPolicies: ISlaPolicy[] = [
    {
        id: 1,
        name: "Standard SLA - Normal Priority",
        description: "Standard SLA policy for regular tickets and IT requests.",
        priority: "normal",
        responseTimeSeconds: 3600, // 1 hour
        resolutionTimeSeconds: 86400, // 24 hours
        isBusinessHourOnly: true,
        isDefault: true,
    },
    {
        id: 2,
        name: "High Priority SLA - Critical Support",
        description: "Fast response and resolution SLA for critical IT issues.",
        priority: "high",
        responseTimeSeconds: 900, // 15 mins
        resolutionTimeSeconds: 14400, // 4 hours
        isBusinessHourOnly: false,
        isDefault: false,
    },
    {
        id: 3,
        name: "Low Priority SLA - General Inquiry",
        description: "Relaxed SLA for non-urgent tasks and general inquiries.",
        priority: "low",
        responseTimeSeconds: 7200, // 2 hours
        resolutionTimeSeconds: 172800, // 48 hours
        isBusinessHourOnly: true,
        isDefault: false,
    },
];

const slaPolicyLocal: ISlaPolicyRepository = {
    getAll: async (): Promise<ISlaPolicy[]> => {
	await delay();
	return [...mockSlaPolicies];
    },
    getById: async (id: number | string): Promise<ISlaPolicy> => {
	await delay();
	const item = mockSlaPolicies.find(s => String(s.id) === String(id));
	if (!item) throw new Error(`SLA Policy with id ${id} not found`);
	return { ...item };
    },
    create: async (payload: ISlaPolicyPayload): Promise<ISlaPolicy> => {
	await delay();
	const newPolicy: ISlaPolicy = {
	    id: Date.now(),
	    name: payload.name,
	    description: payload.description || '',
	    priority: payload.priority || 'normal',
	    responseTimeSeconds: Number(payload.responseTimeSeconds) || 0,
	    resolutionTimeSeconds: Number(payload.resolutionTimeSeconds) || 0,
	    isBusinessHourOnly: Boolean(payload.isBusinessHourOnly),
	    isDefault: Boolean(payload.isDefault),
	};
	if (newPolicy.isDefault) {
	    mockSlaPolicies.forEach(p => p.isDefault = false);
	}
	mockSlaPolicies.push(newPolicy);
	return { ...newPolicy };
    },
    update: async (id: number | string, payload: ISlaPolicyPayload): Promise<ISlaPolicy> => {
	await delay();
	const index = mockSlaPolicies.findIndex(s => String(s.id) === String(id));
	if (index === -1) throw new Error(`SLA Policy with id ${id} not found`);
	if (payload.isDefault) {
	    mockSlaPolicies.forEach(p => p.isDefault = false);
	}
	mockSlaPolicies[index] = {
	    ...mockSlaPolicies[index],
	    name: payload.name,
	    description: payload.description || mockSlaPolicies[index].description,
	    priority: payload.priority || mockSlaPolicies[index].priority,
	    responseTimeSeconds: Number(payload.responseTimeSeconds),
	    resolutionTimeSeconds: Number(payload.resolutionTimeSeconds),
	    isBusinessHourOnly: Boolean(payload.isBusinessHourOnly),
	    isDefault: payload.isDefault !== undefined ? Boolean(payload.isDefault) : mockSlaPolicies[index].isDefault,
	};
	return { ...mockSlaPolicies[index] };
    },
    remove: async (id: number | string) => {
	await delay();
	mockSlaPolicies = mockSlaPolicies.filter(s => String(s.id) !== String(id));
    }
}


const slaPolicyApi: ISlaPolicyRepository = {
    getAll: async (): Promise<ISlaPolicy[]> => {
	const res = await api.get('/sla-policies');
	return res.data;
    },
    getById: async (id: number | string): Promise<ISlaPolicy> => {
	const res = await api.get(`/sla-policies/${id}`);
	return res.data;
    },
    create: async (payload: ISlaPolicyPayload): Promise<ISlaPolicy> => {
	const res = await api.post('/sla-policies', payload);
	return res.data;
    },
    update: async (id: number | string, payload: ISlaPolicyPayload): Promise<ISlaPolicy> => {
	const res = await api.patch(`/sla-policies/${id}`, payload);
	return res.data;
    },
    remove: async (id: number | string) => {
	return await api.delete(`/sla-policies/${id}`);
    }
}


const createSlaPolicyRepository = () => {

    const dataMode = import.meta.env.VITE_DATA_MODE || 'local';
    return dataMode === 'api' ? slaPolicyApi : slaPolicyLocal;
};

export const SlaPolicyRepository = createSlaPolicyRepository();