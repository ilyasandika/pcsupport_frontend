import {TicketTable} from "../../../components/tables/ticket.table.tsx";
import {useLoaderData, useNavigation} from "react-router";
import type {ITicket} from "../../../types/ticket.type.ts";

export const TicketPage = () => {
    const isLoading = useNavigation().state === "loading"
    const ticket = useLoaderData<ITicket[]>()
    return (
	<TicketTable data={ticket} isLoading={isLoading}/>
    )
}