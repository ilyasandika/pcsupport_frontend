
export interface ISlaPolicy {
    id: number;
    name: string;
    description: string;
    responseTimeSeconds: number;
    resolutionTimeSeconds: number;
    isBusinessHourOnly: boolean;
}


export interface ISlaPolicyRepository {
    getSlaPolicies: () => Promise<ISlaPolicy[]>
}