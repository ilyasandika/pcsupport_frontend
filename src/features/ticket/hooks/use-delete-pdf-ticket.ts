import {useMutation, useQueryClient} from "@tanstack/react-query";
import {TicketRepository} from "@/data/repositories/ticket.repository.ts";
import {useNotificationDialog} from "@/context/NotificationDialogContext.tsx";

export const useDeleteTicketPdf = () => {
    const {showNotification} = useNotificationDialog()
    const queryClient = useQueryClient();
    return useMutation({
	mutationFn: (ticketId: number) => TicketRepository.deleteUploadedPdf(ticketId),
	onSuccess: () => {
	    queryClient.invalidateQueries({ queryKey: ['tickets'] });
	    showNotification({
		variant: "success",
		title: "Document Deleted",
		description: "Uploaded ticket PDF document has been deleted successfully",
	    });
	},
	onError: (error: any) => {
	    showNotification({
		variant: "error",
		title: "Failed to delete document",
		description: error.message || "Failed to delete uploaded document",
	    });
	},
    })
}