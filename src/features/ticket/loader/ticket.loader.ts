import {TicketRepository} from "../../../data/repositories/ticket.repository.ts";
import type {LoaderFunctionArgs} from "react-router";

export const ticketLoader = async () => {
    return await TicketRepository.getAllTickets()
}

export const ticketDetailLoader = async ({params}: LoaderFunctionArgs) => {
    const {id} = params as unknown as {id: number}
    return await TicketRepository.getTicketById(id)
}
