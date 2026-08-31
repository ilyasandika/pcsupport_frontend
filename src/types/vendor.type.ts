export interface IVendorContact {
    type: string;
    value: string;
}

export interface IVendor {
    id: number;
    name: string;
    contacts?: IVendorContact[];
    createdAt?: string;
    updatedAt?: string;
}

export interface IVendorPayload {
    name: string;
    contacts?: IVendorContact[];
}

export interface IVendorRepository {
    getAll: () => Promise<IVendor[]>;
    getById: (id: number | string) => Promise<IVendor>;
    create: (payload: IVendorPayload) => Promise<IVendor>;
    update: (id: number | string, payload: IVendorPayload) => Promise<IVendor>;
    remove: (id: number | string) => Promise<void>;
}