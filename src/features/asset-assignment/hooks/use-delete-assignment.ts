import {useMutation, useQueryClient} from "@tanstack/react-query";
import {AssetAssignmentRepository} from "@/data/repositories/asset-assignment.repository.ts";
import type {IErrorResponse} from "@/types/api.type.ts";
import {useNotificationDialog} from "@/context/NotificationDialogContext.tsx";

interface useDeleteAssignmentParams {
    assignmentId: number;
    assetTag: string;
}

export const useDeleteAssignment = () => {
    const {showNotification} = useNotificationDialog()
    const queryClient = useQueryClient();
    return useMutation({
	mutationFn: ({assignmentId}: useDeleteAssignmentParams) => AssetAssignmentRepository.deleteAssignment(assignmentId),
	onSuccess: (_, variables) => {
	    queryClient.invalidateQueries({ queryKey: ['asset', 'detail', variables.assetTag] });
	    showNotification({
		variant: "success",
		title: "Assignment Deleted",
		description: "Assignment record has been deleted successfully.",
	    });
	},
	onError: (err: IErrorResponse) => {
	    showNotification({
		variant: "error",
		title: "Failed to delete assignment",
		description: err.message || "An error occurred while deleting assignment.",
	    });
	},
    });
};