import { delay } from "../../helper/helper.tsx";
import type { IVendor, IVendorPayload, IVendorRepository } from "@/types/vendor.type.ts";
import api from "../api/interceptors.ts";

let mockVendors: IVendor[] = [
    {
        id: 1,
        name: "PT Lenovo Indonesia",
        contacts: [
            { type: "Phone", value: "021-50880000" },
            { type: "Email", value: "support.id@lenovo.com" },
            { type: "WhatsApp", value: "+6281234567890" },
        ],
    },
    {
        id: 2,
        name: "PT Dell Indonesia",
        contacts: [
            { type: "Phone", value: "021-29955888" },
            { type: "Email", value: "customer_support@dell.com" },
        ],
    },
    {
        id: 3,
        name: "PT HP Indonesia",
        contacts: [
            { type: "Phone", value: "0800-111-3388" },
        ],
    },
    { id: 4, name: "PT Asus Indonesia" },
];

const vendorLocal: IVendorRepository = {
    getAll: async (): Promise<IVendor[]> => {
        await delay();
        return [...mockVendors];
    },
    getById: async (id: number | string): Promise<IVendor> => {
        await delay();
        const vendor = mockVendors.find(v => String(v.id) === String(id));
        if (!vendor) throw new Error(`Vendor with id ${id} not found`);
        return { ...vendor };
    },
    create: async (payload: IVendorPayload): Promise<IVendor> => {
        await delay();
        const newVendor: IVendor = {
            id: Date.now(),
            name: payload.name,
            contacts: payload.contacts || [],
        };
        mockVendors.push(newVendor);
        return { ...newVendor };
    },
    update: async (id: number | string, payload: IVendorPayload): Promise<IVendor> => {
        await delay();
        const index = mockVendors.findIndex(v => String(v.id) === String(id));
        if (index === -1) throw new Error(`Vendor with id ${id} not found`);
        mockVendors[index] = {
            ...mockVendors[index],
            name: payload.name,
            contacts: payload.contacts || [],
        };
        return { ...mockVendors[index] };
    },
    remove: async (id: number | string) => {
        await delay();
        mockVendors = mockVendors.filter(v => String(v.id) !== String(id));
    }
};

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
};

const createVendorRepository = () => {
    const dataMode = import.meta.env.VITE_DATA_MODE || 'local';
    return dataMode === 'api' ? vendorApi : vendorLocal;
};

export const VendorRepository = createVendorRepository();