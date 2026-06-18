import {TicketRepository} from "../../../data/repositories/ticket.repository.ts";

export const ticketLoader = async () => {
    return await TicketRepository.getAllTickets()
}