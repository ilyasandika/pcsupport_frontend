import {useMutation, useQueryClient} from "@tanstack/react-query";
import {AssetAssignmentRepository} from "@/data/repositories/asset-assignment.repository.ts";
import type {IErrorResponse} from "@/types/api.type.ts";
import {useNotificationDialog} from "@/context/NotificationDialogContext.tsx";


interface useUploadBastParams {
    assignmentId: number;
    file: File;
    type: "assign" | "return";
}

export const useUploadBast = () => {
    const queryClient = useQueryClient();
    const {showNotification} = useNotificationDialog()
    return useMutation({
	mutationFn: ({assignmentId, file, type} : useUploadBastParams) =>  AssetAssignmentRepository.uploadDocument(assignmentId, file, type),
	onSuccess: () => {
	    queryClient.invalidateQueries({ queryKey: ['asset', 'detail'] });
	    showNotification({
		variant: "success",
		title: "BAST Uploaded",
		description: "BAST has been uploaded successfully.",
	    });
	},
	onError: (err: IErrorResponse) => {
	    showNotification({
		variant: "error",
		title: "Failed to upload BAST",
		description: `Error: ${err.message}, ${err.errors.map((e) => e.message).join(", ")}`,
	    });
	},
    })
}