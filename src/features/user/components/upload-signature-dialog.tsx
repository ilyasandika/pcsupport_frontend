import { useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { UserRepository } from "@/data/repositories/user.repository.ts";
import { useFormErrors } from "@/hooks/use-errors.ts";
import type { IErrorResponse } from "@/types/api.type.ts";
import { UploadFile } from "@/components/upload-file.tsx";
import { useNotificationDialog } from "@/context/NotificationDialogContext";
import { DialogContainer } from "@/components/dialog-container.tsx";

interface UploadSignatureDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	userId?: number;
	userName?: string;
	onSuccess?: () => void;
}

export const UploadSignatureDialog = ({
	open,
	onOpenChange,
	userId,
	userName,
	onSuccess,
}: UploadSignatureDialogProps) => {
	const { showNotification } = useNotificationDialog();
	const { setErrors } = useFormErrors();
	const fileRef = useRef<File | null>(null);
	const [file, setFile] = useState<File | null>(null);

	const uploadMutation = useMutation({
		mutationFn: async ({ userId, file }: { userId: number; file: File }) => {
			return await UserRepository.uploadSignature(userId, file);
		},
		onSuccess: () => {
			onOpenChange(false);
			setFile(null);
			fileRef.current = null;
			showNotification({
				variant: "success",
				title: "Signature Uploaded",
				description: "User signature has been uploaded successfully.",
				onClose: () => {
					if (onSuccess) {
						onSuccess();
					} else {
						window.location.reload();
					}
				},
			});
		},
		onError: (error: IErrorResponse) => {
			setErrors(
				error?.errors || [
					{
						field: "file",
						message: ["Failed to upload signature. Ensure file size is < 1MB and format is PNG/JPG."],
					},
				]
			);
			showNotification({
				variant: "error",
				title: "Signature upload failed",
				description: error?.errors?.map((err) => err.message).join(", ") || "Failed to upload signature. Ensure file size is < 1MB and format is PNG/JPG.",
				onClose: () => {
					if (onSuccess) {
						onSuccess();
					} else {
						window.location.reload();
					}
				},
			});
		},
	});

	const handleUpload = () => {
		if (!userId || !file) {
			setErrors([
				{
					field: "file",
					message: ["Please select a signature file"],
				},
			]);
			return;
		}

		uploadMutation.mutate({ userId, file });
	};

	return (
		<DialogContainer
			open={open}
			setOpen={onOpenChange}
			title={"Upload Signature"}
			description={userName ? `Upload signature image for ${userName}` : "Upload signature image for this user"}
			onContinue={handleUpload}
		>
			<div className="flex flex-col gap-4 py-2">
				<UploadFile
					label="Signature Image"
					description="Upload PNG or JPG image (max 1MB)"
					fileRef={fileRef}
					setFile={setFile}
					acceptedFileTypes="image/png,image/jpeg,image/jpg"
				/>
			</div>
		</DialogContainer>
	);
};

