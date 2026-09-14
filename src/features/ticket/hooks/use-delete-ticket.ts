import {useMutation, useQueryClient} from "@tanstack/react-query";
import {TicketRepository} from "@/data/repositories/ticket.repository.ts";
import {useNotificationDialog} from "@/context/NotificationDialogContext.tsx";

export const useDeleteTicket = () => {
    const {showNotification} = useNotificationDialog()
    const queryClient = useQueryClient();


    return useMutation({
	mutationFn: (id: number) => TicketRepository.hardRemoveTicket(id),
	onSuccess: () => {
	    queryClient.invalidateQueries({ queryKey: ['tickets'] });
	    showNotification({
		variant: "success",
		title: "Ticket has been deleted",
		description: "Ticket has been deleted successfully",
		onClose: () => window.location.reload(),
	    })
	},
	onError: () => {
	    showNotification({
		variant: "error",
		title: "Failed to delete ticket",
		description: "Failed to delete ticket",
		onClose: () => window.location.reload(),
	    })
	}
    })
}
