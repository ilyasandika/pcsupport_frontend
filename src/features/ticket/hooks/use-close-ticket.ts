import {TicketRepository} from "@/data/repositories/ticket.repository.ts";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useNotificationDialog} from "@/context/NotificationDialogContext.tsx";
import type {ICloseTicket} from "@/types/ticket.type.ts";

export const useCloseTicket = () => {
    const queryClient = useQueryClient();
    const {showNotification} = useNotificationDialog()
    return useMutation({
	mutationFn: ({id, payload}: {id: number, payload: ICloseTicket}) => TicketRepository.closeTicket(id, payload),
	onSuccess: () => {
	    queryClient.invalidateQueries({ queryKey: ['tickets'] });
	    showNotification({
		variant: "success",
		title: "Ticket has been closed",
		description: "Ticket has been closed successfully",
		onClose: () => window.location.reload(),
	    })
	},
    });
};