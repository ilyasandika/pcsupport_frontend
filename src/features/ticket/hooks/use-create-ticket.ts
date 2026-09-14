import {useMutation, useQueryClient} from "@tanstack/react-query";
import type {ICreateTicketPayload} from "@/types/ticket.type.ts";
import {TicketRepository} from "@/data/repositories/ticket.repository.ts";
import {useNotificationDialog} from "@/context/NotificationDialogContext.tsx";
import {useNavigate} from "react-router";

export const useCreateTicket = () => {
    const {showNotification} = useNotificationDialog()
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    return useMutation({
	mutationFn: (payload: ICreateTicketPayload) => TicketRepository.createTicket(payload),
	onSuccess: () => {
	    queryClient.invalidateQueries({ queryKey: ['tickets'] });
	    showNotification({
		variant: "success",
		title: "Ticket successfully created",
		description: "New ticket has been created.",
		onClose: () => navigate("/tickets"),
	    })
	},
    })
};
