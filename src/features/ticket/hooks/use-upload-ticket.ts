import {useMutation, useQueryClient} from "@tanstack/react-query";
import {TicketRepository} from "@/data/repositories/ticket.repository.ts";
import {useNotificationDialog} from "@/context/NotificationDialogContext.tsx";
import type {IErrorResponse} from "@/types/api.type.ts";
import {useNavigate} from "react-router";

export const useUploadTicket = () => {
    const queryClient = useQueryClient();
    const {showNotification} = useNotificationDialog()
    const navigate = useNavigate();

    return useMutation({
	mutationFn: ({id, file} : {id: number, file: File}) => TicketRepository.uploadTicket(id, file),
	onSuccess: () => {
	    queryClient.invalidateQueries({queryKey: ['tickets']})
	    showNotification({
		variant: "success",
		title: "Ticket file has been uploaded",
		description: "Ticket file has been uploaded successfully",
		onClose: () => navigate("/tickets"),
	    })
	},
	onError: (err: IErrorResponse) => {
	    showNotification({
		variant: "error",
		title: "Ticket File Failed to Upload",
		description: `Error: ${err.message}, make sure the file is a pdf and less than 1MB`,
		onClose: () => navigate("/tickets"),
	    })
	}
    })
};