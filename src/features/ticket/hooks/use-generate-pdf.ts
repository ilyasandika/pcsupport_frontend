import {useMutation, useQueryClient} from "@tanstack/react-query";
import type {IPrintTicketPayload} from "@/types/ticket.type.ts";
import {TicketRepository} from "@/data/repositories/ticket.repository.ts";
import {AssetAssignmentRepository} from "@/data/repositories/asset-assignment.repository.ts";
import {useNotificationDialog} from "@/context/NotificationDialogContext.tsx";
import type {IErrorResponse} from "@/types/api.type.ts";

export const useGeneratePdf = () => {
    const queryClient = useQueryClient();
    const {showNotification} = useNotificationDialog()
    return useMutation({
	mutationFn: async ({isTicket, id, payload, type} : {isTicket: boolean, id: number, payload: IPrintTicketPayload, type?: "assign" | "return"}) => {
	    if (isTicket) {
		return TicketRepository.generateTicketPdf(id, payload);
	    }
	    if (type){
		return AssetAssignmentRepository.generateDocument(id, payload, type);
	    }
	},
	onSuccess: () => {
	    queryClient.invalidateQueries({ queryKey: ['tickets'] });
	    queryClient.invalidateQueries({ queryKey: ['assets'] });
	},
	onError: (err: IErrorResponse) => {
	    console.log(err)
	    showNotification({
		variant: "error",
		title: "Failed to Generate PDF",
		description: `Error: ${err.errors?.[0]?.message || "Failed to generate PDF"}`,
	    })
	},

    })
};