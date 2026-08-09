import {ExternalTicketTable} from "@/components/tables/external-ticket.table.tsx";
import {useLoaderData} from "react-router";

export const ExternalTicketPage = () => {
    const {externalTickets} = useLoaderData()
    return (
	<div>
	    <ExternalTicketTable data={externalTickets}/>
	</div>
    )
}