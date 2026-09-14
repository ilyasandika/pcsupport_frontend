import {useMutation, useQueryClient} from "@tanstack/react-query";
import type {IUpdateTicketPayload} from "@/types/ticket.type.ts";
import {TicketRepository} from "@/data/repositories/ticket.repository.ts";
import {useNotificationDialog} from "@/context/NotificationDialogContext.tsx";
import {useNavigate} from "react-router";

export const useUpdateTicket = () => {
    const {showNotification} = useNotificationDialog()
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    return useMutation({
	mutationFn: ({id, payload}: {
	    id: number,
	    payload: IUpdateTicketPayload
	}) => TicketRepository.updateTicket(id, payload),
	onSuccess: () => {
	    queryClient.invalidateQueries({ queryKey: ['tickets'] });
	    showNotification({
		variant: "success",
		title: "Ticket Successfully Updated",
		description: "Ticket has been updated successfully.",
		onClose: () => navigate("/tickets"),
	    })
	},
    })
};