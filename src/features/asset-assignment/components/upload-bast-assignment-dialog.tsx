import {useRef, useState} from "react";
import {useFormErrors} from "@/hooks/use-errors.ts";
import {UploadFile} from "@/components/upload-file.tsx";
import {DialogContainer} from "@/components/dialog-container.tsx";
import {useUploadBast} from "@/features/asset-assignment/hooks/use-upload-bast.tsx";
import {capitalizeWords} from "@/helper/helper.tsx";

interface UploadBastAssignmentDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    assignmentId: number;
    type: "assign" | "return"
}

export const UploadBastAssignmentDialog = ({
                                               open,
                                               onOpenChange,
                                               assignmentId,
                                               type
                                          }: UploadBastAssignmentDialogProps) => {
    const {setErrors} = useFormErrors();
    const fileRef = useRef<File | null>(null);
    const [file, setFile] = useState<File | null>(null);

    const {mutateAsync: uploadBast} = useUploadBast()
    const handleUpload = async () => {
        if (!file) {
            setErrors([{
                field: "file",
                message:["please select a file"],
            }]);
            return;
        }
        await uploadBast({assignmentId, file, type})
    };

    return (
        <DialogContainer
            title={`${`Upload BAST ${capitalizeWords(type)} Document`}`}
            description={"Upload PDF File Under 1 MB"}
            type="dialog"
            open={open}
            setOpen={onOpenChange}
            onContinue={handleUpload}
        >
            <UploadFile
                label="BAST File"
                description="Upload PDF file"
                fileRef={fileRef}
                setFile={setFile}
                acceptedFileTypes=".pdf"
            />

        </DialogContainer>
    );
};
