import {useMutation, useQueryClient} from "@tanstack/react-query";
import {AssetRepository} from "@/data/repositories/asset.repository.ts";
import type {IErrorResponse} from "@/types/api.type.ts";
import {useNotificationDialog} from "@/context/NotificationDialogContext.tsx";

export const useDeleteAsset = () => {
    const {showNotification} = useNotificationDialog()
    const queryClient = useQueryClient()

    return useMutation({
	mutationFn: async (assetTag: string) => await AssetRepository.deleteAsset(assetTag),
	onSuccess: () => {
	    queryClient.invalidateQueries({queryKey: ['assets']})
	    showNotification({
		variant: "success",
		title: "Asset has been deleted",
		description: "Asset has been deleted successfully",
	    })
	},
	onError: (err: IErrorResponse) => {
	    showNotification({
		variant: "error",
		title: "Asset Failed to Delete",
		description: `Error: ${err.message}, ${err.errors.map((e) => e.message).join(", ")}`,
	    })
	}
    });
};