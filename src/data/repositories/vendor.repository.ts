import type {IVendor, IVendorPayload, IVendorRepository} from "@/types/vendor.type.ts";
import api from "../api/interceptors.ts";

const vendorApi: IVendorRepository = {
    getAll: async (): Promise<IVendor[]> => {
	const res = await api.get('/vendors');
	return res.data;
    },
    getById: async (id: number | string): Promise<IVendor> => {
	const res = await api.get(`/vendors/${id}`);
	return res.data;
    },
    create: async (payload: IVendorPayload): Promise<IVendor> => {
	const res = await api.post('/vendors', payload);
	return res.data;
    },
    update: async (id: number | string, payload: IVendorPayload): Promise<IVendor> => {
	const res = await api.patch(`/vendors/${id}`, payload);
	return res.data;
    },
    remove: async (id: number | string) => {
	return await api.delete(`/vendors/${id}`);
    }
}


const createVendorRepository = () => {
    return vendorApi
};

export const VendorRepository = createVendorRepository();