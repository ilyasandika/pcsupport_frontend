import {useRef, useState} from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Upload} from "lucide-react";
import {AssetAssignmentRepository} from "@/data/repositories/asset-assignment.repository.ts";
import {useFormErrors} from "@/hooks/use-errors.ts";
import type {IErrorResponse} from "@/types/api.type.ts";
import {UploadFile} from "@/components/upload-file.tsx";

interface UploadBastAssignmentDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    assignmentId: number | string;
    employeeName?: string;
    onSuccess?: () => void;
}

export const UploadBastAssignmentDialog = ({
                                              open,
                                              onOpenChange,
                                              assignmentId,
                                              employeeName,
                                              onSuccess,
                                          }: UploadBastAssignmentDialogProps) => {
    const {setErrors} = useFormErrors();
    const fileRef = useRef<File | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleUpload = async () => {
        if (!file) {
            setErrors([{
                field: "file",
                message:["please select a file"],
            }]);
            return;
        }

        setIsUploading(true);
        try {
            await AssetAssignmentRepository.uploadDocument(assignmentId, file);
            onOpenChange(false);
            onSuccess?.();
            setFile(null);
            fileRef.current = null;
        } catch (error) {
            setErrors((error as IErrorResponse).errors);
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
                <DialogTrigger/>
                <DialogHeader>
                    <DialogTitle>Upload BAST Document</DialogTitle>
                    <DialogDescription>
                        {employeeName
                            ? `Upload BAST document for ${employeeName}`
                            : "Upload BAST document for this assignment"
                        }
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-4 py-2">
                    <UploadFile
                        label="BAST File"
                        description="Upload PDF file"
                        fileRef={fileRef}
                        setFile={setFile}
                        acceptedFileTypes=".pdf"
                    />
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={handleCancel} disabled={isUploading}>
                        Cancel
                    </Button>
                    <Button onClick={handleUpload} disabled={isUploading || !file}>
                        <Upload className="size-4 mr-1.5"/>
                        {isUploading ? "Uploading..." : "Upload"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
