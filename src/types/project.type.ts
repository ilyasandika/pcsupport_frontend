import type {IVendor} from "@/types/vendor.type.ts";

export interface IProject {
    id: number;
    name: string;
    description: string;
    vendorId: number;
    vendor?: IVendor;
}

export interface IProjectPayload {
    name: string;
    description?: string;
    vendorId: number;
}

export interface IProjectRepository {
    getAll: () => Promise<IProject[]>;
    getById: (id: number | string) => Promise<IProject>;
    create: (payload: IProjectPayload) => Promise<IProject>;
    update: (id: number | string, payload: IProjectPayload) => Promise<IProject>;
    remove: (id: number | string) => Promise<void>;
}