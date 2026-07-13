export interface ICreateTicketDto {
    assetSn?: string;
    employeeNik: string;
    engineerId?: number;
    // status: TicketStatusType;
    problem: string;
    slaPolicyId: number;
    locationId: number;
    solution?: string;
    solvedAt?: Date;
    remarks?: string;
    fullNumberTemplate?: string;
}