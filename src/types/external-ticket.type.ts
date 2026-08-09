import {type ITicket } from "@/types/ticket.type.ts";
import type {IVendor} from "@/types/vendor.type.ts";

export interface IExternalTicket {
    id: number;
    ticketFullNumber: string;
    ticket: ITicket;
    vendor: IVendor;
    caseNumber?: string;
    problem: string;
    status: string;
    resolution?: string;
    escalatedDate: Date;
    resolvedDate?: Date;
    createdAt: Date;
    updatedAt: Date;
}

export const ExternalTicketStatus = {
    InProgress : 'in progress',
    Closed : 'closed',
    Cancelled : 'cancelled',
} as const

export interface IExternalTicketPayload {
    ticketId: number;
    vendorId: number;
    caseNumber: string;
    problem: string;
    resolution?: string;
    status: string;
    escalatedDate?: string;
    resolvedDate?: string;
}


export type ExternalTicketStatusType = typeof ExternalTicketStatus[keyof typeof ExternalTicketStatus];

export interface IExternalTicketRepository {
    getAll: () => Promise<IExternalTicket[]>;
    getById: (id: number | string) => Promise<IExternalTicket>;
    create: (payload: IExternalTicketPayload) => Promise<IExternalTicket>;
    update: (id: number | string, payload: IExternalTicketPayload) => Promise<IExternalTicket>;
    remove: (id: number | string) => Promise<void>;
}

