import {useMutation, useQueryClient} from "@tanstack/react-query";
import {AssetAssignmentRepository} from "@/data/repositories/asset-assignment.repository.ts";
import {useNotificationDialog} from "@/context/NotificationDialogContext.tsx";
import type {IErrorResponse} from "@/types/api.type.ts";

interface useDeleteDocument {
    assignmentId: number;
    type: "assign" | "return";
}

export const useDeleteDocument = () => {
    const queryClient = useQueryClient();
    const {showNotification} = useNotificationDialog()
    return useMutation({
	mutationFn: ({assignmentId, type}: useDeleteDocument) => AssetAssignmentRepository.deleteDocument(assignmentId, type),
	onSuccess: () => {
	    queryClient.invalidateQueries({ queryKey: ['asset', 'detail'] });
	    showNotification({
		variant: "success",
		title: "BAST Deleted Successfully",
		description: "BAST has been deleted successfully.",
	    })
	},
	onError: (err: IErrorResponse) => {
	    showNotification({
		variant: "error",
		title: "BAST Failed to Delete",
		description: `Error: ${err.message}, ${err.errors.map((e) => e.message).join(", ")}`,
	    })
	}
    })
}