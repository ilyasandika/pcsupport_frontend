import { useRef, useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { TemplateRepository } from "@/data/repositories/template.repository.ts";
import { useFormErrors } from "@/hooks/use-errors.tsx";
import type { IErrorResponse } from "@/types/api.type.ts";
import { UploadFile } from "@/components/upload-file.tsx";
import { TemplateType, type ITemplate } from "@/types/template.type.ts";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { useNotificationDialog } from "@/context/NotificationDialogContext.tsx";

interface UploadTemplateDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialData?: ITemplate | null;
    onSuccess?: () => void;
}

const templateTypeLabels: Record<TemplateType, string> = {
    [TemplateType.Ticket]: "Ticket Template",
    [TemplateType.BastAssign]: "BAST Assign Template",
    [TemplateType.BastReturn]: "BAST Return Template",
    [TemplateType.BastBackup]: "BAST Backup Template",
};

export const UploadTemplateDialog = ({
    open,
    onOpenChange,
    initialData,
    onSuccess,
}: UploadTemplateDialogProps) => {
    const { setErrors, clearErrors, getFieldErrors } = useFormErrors();
    const { showNotification } = useNotificationDialog();

    const fileRef = useRef<File | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [type, setType] = useState<TemplateType>(TemplateType.Ticket);
    const [description, setDescription] = useState<string>("");
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        if (open) {
            clearErrors();
            setFile(null);
            fileRef.current = null;

            if (initialData) {
                setType(initialData.type);
                setDescription(initialData.description || "");
            } else {
                setType(TemplateType.Ticket);
                setDescription("");
            }
        }
    }, [open, initialData]);

    const handleUpload = async () => {
        if (!file) {
            setErrors([
                {
                    field: "file",
                    message: ["Please select a Word document (.docx) file"],
                },
            ]);
            return;
        }

        setIsUploading(true);
        try {
            await TemplateRepository.upload({
                type,
                description,
                file,
            });
            showNotification({
                variant: "success",
                title: "Template Saved",
                description: `Template ${templateTypeLabels[type]} successfully uploaded.`,
            });
            onOpenChange(false);
            onSuccess?.();
        } catch (error) {
            const err = error as IErrorResponse;
            if (err && err.errors) {
                setErrors(err.errors);
            } else {
                showNotification({
                    variant: "error",
                    title: "Failed to upload",
                    description: err?.message || "Failed to upload template, please try again.",
                });
            }
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
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>
                        {initialData ? "Update Document Template" : "Upload New Template"}
                    </DialogTitle>
                    <DialogDescription>
                        Upload a Microsoft Word (.docx) document template for system reporting and generation.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-4 py-2">
                    <Field>
                        <FieldLabel htmlFor="template-type">Template Type</FieldLabel>
                        <Select
                            value={type}
                            onValueChange={(val) => setType(val as TemplateType)}
                            disabled={isUploading}
                        >
                            <SelectTrigger id="template-type">
                                <SelectValue placeholder="Select template type" />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.entries(templateTypeLabels).map(([key, label]) => (
                                    <SelectItem key={key} value={key}>
                                        {label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {getFieldErrors("type") && (
                            <p className="text-xs text-red-500 mt-1">{getFieldErrors("type")}</p>
                        )}
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="template-description">Description (Optional)</FieldLabel>
                        <Textarea
                            id="template-description"
                            placeholder="Brief description about the purpose of this template..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            disabled={isUploading}
                            rows={3}
                        />
                        <FieldDescription>
                            Explain how or where this template will be used.
                        </FieldDescription>
                        {getFieldErrors("description") && (
                            <p className="text-xs text-red-500 mt-1">{getFieldErrors("description")}</p>
                        )}
                    </Field>

                    <div>
                        <UploadFile
                            label="Template File (.docx)"
                            description="Only Microsoft Word (.docx) documents up to 1MB are accepted."
                            fileRef={fileRef}
                            setFile={setFile}
                            acceptedFileTypes=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        />
                        {getFieldErrors("file") && (
                            <p className="text-xs text-red-500 mt-1">{getFieldErrors("file")}</p>
                        )}
                    </div>
                </div>

                <DialogFooter className="mt-2">
                    <Button variant="outline" onClick={handleCancel} disabled={isUploading}>
                        Cancel
                    </Button>
                    <Button onClick={handleUpload} disabled={isUploading || !file}>
                        <Upload className="size-4 mr-1.5" />
                        {isUploading ? "Uploading..." : "Save Template"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
