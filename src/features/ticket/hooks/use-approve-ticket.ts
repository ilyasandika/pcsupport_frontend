import {useMutation, useQueryClient} from "@tanstack/react-query";
import {TicketRepository} from "@/data/repositories/ticket.repository.ts";
import {useAuth} from "@/context/AuthContext.tsx";
import type {IErrorResponse} from "@/types/api.type.ts";
import {useNotificationDialog} from "@/context/NotificationDialogContext.tsx";

export const useApproveTicket = () => {
    const queryClient = useQueryClient();
    const {user} = useAuth()
    const {showNotification} = useNotificationDialog()

    return useMutation({
	mutationFn: (ticketId: number) => {
	    if (!user?.sub) throw new Error("Unauthorized");
	    return TicketRepository.approveTicket(ticketId, user?.sub);
	},
	onSuccess: () => {
	    queryClient.invalidateQueries({ queryKey: ['tickets'] });
	    showNotification({
		variant: "success",
		title: "Ticket Approved",
		description: "Ticket has been approved successfully",
		onClose: () => window.location.reload(),
	    });
	},
	onError: (err: IErrorResponse) => {
	    showNotification({
		variant: "error",
		title: "Cannot approve ticket",
		description: `Error: ${err.message}`,
	    });
	},
    })
};