import { useRef, useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { UserRepository } from "@/data/repositories/user.repository.ts";
import { useFormErrors } from "@/hooks/use-errors.tsx";
import type { IErrorResponse } from "@/types/api.type.ts";
import { UploadFile } from "@/components/upload-file.tsx";
import { useNotificationDialog } from "@/components/notification-dialog.tsx";

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
	const [isUploading, setIsUploading] = useState(false);

	const handleUpload = async () => {
		if (!userId || !file) {
			setErrors([
				{
					field: "file",
					message: ["Please select a signature file"],
				},
			]);
			return;
		}

		setIsUploading(true);
		try {
			await UserRepository.uploadSignature(userId, file);
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
		} catch (error) {
			setErrors((error as IErrorResponse).errors || [
				{
					field: "file",
					message: ["Failed to upload signature. Ensure file size is < 1MB and format is PNG/JPG."],
				},
			]);
		} finally {
			setIsUploading(false);
		}
	};

	const handleCancel = () => {
		setFile(null);
		fileRef.current = null;
		onOpenChange(false);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogTrigger />
				<DialogHeader>
					<DialogTitle>Upload Signature</DialogTitle>
					<DialogDescription>
						{userName
							? `Upload signature image for ${userName}`
							: "Upload signature image for this user"}
					</DialogDescription>
				</DialogHeader>
				<div className="flex flex-col gap-4 py-2">
					<UploadFile
						label="Signature Image"
						description="Upload PNG or JPG image (max 1MB)"
						fileRef={fileRef}
						setFile={setFile}
						acceptedFileTypes="image/png,image/jpeg,image/jpg"
					/>
				</div>

				<DialogFooter>
					<Button variant="outline" onClick={handleCancel} disabled={isUploading}>
						Cancel
					</Button>
					<Button onClick={handleUpload} disabled={isUploading || !file}>
						<Upload className="size-4 mr-1.5" />
						{isUploading ? "Uploading..." : "Upload Signature"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
