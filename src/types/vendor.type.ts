export interface IVendor {
    name: string;
    description?: string;
}

export interface IVendorPayload {
    name: string;
}

export interface IVendorRepository {
    getAll: () => Promise<IVendor[]>;
    getById: (id: number | string) => Promise<IVendor>;
    create: (payload: IVendorPayload) => Promise<IVendor>;
    update: (id: number | string, payload: IVendorPayload) => Promise<IVendor>;
    remove: (id: number | string) => Promise<void>;
}