import {TicketTable} from "@/components/tables/ticket.table.tsx";
import {useLoaderData, useNavigation} from "react-router";
import type {ITicket} from "@/types/ticket.type.ts";
import type {IDetailWorkLocation} from "@/types/work-location.type.ts";
import type {ISuccessResponse} from "@/types/api.type.ts";

export const TicketPage = () => {
    const isLoading = useNavigation().state === "loading"
    const { locations } = useLoaderData<{ tickets: ISuccessResponse<ITicket[]>, locations: IDetailWorkLocation[] }>()
    return (
	<TicketTable locations={locations} isLoading={isLoading}/>
    )
}