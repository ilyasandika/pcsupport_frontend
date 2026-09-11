import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useNavigate} from "react-router";
import {TicketRepository} from "@/data/repositories/ticket.repository.ts";
import {useNotificationDialog} from "@/context/NotificationDialogContext.tsx";

export const useClaimTicket = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const {showNotification} = useNotificationDialog();

    return useMutation({
	mutationFn: (ticketId: number) => TicketRepository.claimTicket(ticketId),

	onSuccess: () => {
	    queryClient.invalidateQueries({ queryKey: ['tickets'] });

	    showNotification({
		variant: "success",
		title: "Ticket successfully claimed.",
		description: "New ticket has been claimed. You can now start working on it.",
		onClose: () => navigate("/tickets"),
	    });
	},

	onError: (err: any) => {
	    showNotification({
		variant: "error",
		title: "Cannot claim ticket",
		description: `Error: ${err?.message || 'Something went wrong'}`,
		onClose: () => navigate("/tickets"),
	    });
	},
    });
};