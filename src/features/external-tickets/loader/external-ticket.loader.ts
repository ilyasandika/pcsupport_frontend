import { ExternalTicketRepository } from "@/data/repositories/external-ticket.repository.ts";
import type { LoaderFunctionArgs } from "react-router";
import { TicketRepository } from "@/data/repositories/ticket.repository.ts";
import { VendorRepository } from "@/data/repositories/vendor.repository.ts";

export const externalTicketLoader = async () => {
    const [externalTickets] = await Promise.all([
        ExternalTicketRepository.getAll(),
    ]);
    return { externalTickets };
};

export const externalTicketFormLoader = async ({ params }: LoaderFunctionArgs) => {
    const { id } = params as unknown as { id: number };
    const [ticketsResponse, vendors, externalTicket] = await Promise.all([
        TicketRepository.getAll({ hasBackupAsset: true, limit: 100 }),
        VendorRepository.getAll(),
        id ? ExternalTicketRepository.getById(+id) : Promise.resolve(null),
    ]);

    const tickets = ticketsResponse?.data || (Array.isArray(ticketsResponse) ? (ticketsResponse as any) : []);

    return { tickets, vendors, externalTicket };
};