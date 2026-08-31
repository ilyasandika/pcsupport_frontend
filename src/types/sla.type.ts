
export interface ISlaPolicy {
    id: number;
    name: string;
    description: string;
    isDefault: boolean;
    priority: "low" | "normal" | "medium" | "high";
    responseTimeSeconds: number;
    resolutionTimeSeconds: number;
    isBusinessHourOnly: boolean;
}

export interface ISlaPolicyPayload {
    name: string;
    description?: string;
    priority?: "low" | "normal" | "medium" | "high";
    responseTimeSeconds: number;
    resolutionTimeSeconds: number;
    isBusinessHourOnly: boolean;
    isDefault?: boolean;
}

export interface ISlaPolicyRepository {
    getAll: () => Promise<ISlaPolicy[]>
    getById: (id: number | string) => Promise<ISlaPolicy>;
    create: (payload: ISlaPolicyPayload) => Promise<ISlaPolicy>;
    update: (id: number | string, payload: ISlaPolicyPayload) => Promise<ISlaPolicy>;
    remove: (id: number | string) => Promise<void>;
}


