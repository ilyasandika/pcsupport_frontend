import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea.tsx";
import { Field, FieldLabel } from "@/components/ui/field.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx";
import { ProjectRepository } from "@/data/repositories/project.repository.ts";
import { VendorRepository } from "@/data/repositories/vendor.repository.ts";
import { useFormErrors } from "@/hooks/use-errors.ts";
import type { IErrorResponse } from "@/types/api.type.ts";
import type { IProject, IProjectPayload } from "@/types/project.type.ts";
import type { IVendor } from "@/types/vendor.type.ts";
import { useNotificationDialog } from "@/context/NotificationDialogContext.tsx";
import { FolderKanban } from "lucide-react";

interface ProjectDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialData?: IProject | null;
    vendors?: IVendor[];
    onSuccess?: () => void;
}

export const ProjectDialog = ({
    open,
    onOpenChange,
    initialData,
    vendors: propVendors,
    onSuccess,
}: ProjectDialogProps) => {
    const { setErrors, clearErrors, getFieldErrors } = useFormErrors();
    const { showNotification } = useNotificationDialog();

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [vendorId, setVendorId] = useState<string>("");
    const [vendorList, setVendorList] = useState<IVendor[]>(propVendors || []);

    useEffect(() => {
        if (open) {
            clearErrors();

            if (!propVendors || propVendors.length === 0) {
                VendorRepository.getAll()
                    .then((data) => setVendorList(data))
                    .catch((err) => console.error("Failed to load vendors:", err));
            } else {
                setVendorList(propVendors);
            }

            if (initialData) {
                setName(initialData.name || "");
                setDescription(initialData.description || "");
                setVendorId(initialData.vendorId ? String(initialData.vendorId) : "");
            } else {
                setName("");
                setDescription("");
                setVendorId("");
            }
        }
    }, [open, initialData, propVendors]);

    const createMutation = useMutation({
        mutationFn: (payload: IProjectPayload) => ProjectRepository.create(payload),
        onSuccess: () => {
            showNotification({
                variant: "success",
                title: "Project Created",
                description: `Project "${name}" has been created successfully.`,
            });
            onOpenChange(false);
            onSuccess?.();
        },
        onError: (error: IErrorResponse) => {
            if (error && error.errors) {
                setErrors(error.errors);
            } else {
                showNotification({
                    variant: "error",
                    title: "Action Failed",
                    description: error?.message || "Failed to create project. Please try again.",
                });
            }
        },
    });

    const updateMutation = useMutation({
        mutationFn: (payload: IProjectPayload) => {
            const targetId = initialData?.id ?? initialData!.name;
            return ProjectRepository.update(targetId, payload);
        },
        onSuccess: () => {
            showNotification({
                variant: "success",
                title: "Project Updated",
                description: `Project "${name}" has been updated successfully.`,
            });
            onOpenChange(false);
            onSuccess?.();
        },
        onError: (error: IErrorResponse) => {
            if (error && error.errors) {
                setErrors(error.errors);
            } else {
                showNotification({
                    variant: "error",
                    title: "Action Failed",
                    description: error?.message || "Failed to update project. Please try again.",
                });
            }
        },
    });

    const isSubmitting = createMutation.isPending || updateMutation.isPending;

    const handleSubmit = () => {
        if (!name.trim() || !vendorId) return;
        clearErrors();

        const payload: IProjectPayload = {
            name: name.trim(),
            description: description.trim() || undefined,
            vendorId: parseInt(vendorId, 10),
        };

        if (initialData) {
            updateMutation.mutate(payload);
        } else {
            createMutation.mutate(payload);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <FolderKanban className="w-5 h-5 text-ptba-primary" />
                        {initialData ? "Edit Project" : "Add Project"}
                    </DialogTitle>
                    <DialogDescription>
                        {initialData
                            ? "Update project details and assigned vendor."
                            : "Add a new procurement project or contract."
                        }
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-4 py-2">
                    <Field>
                        <FieldLabel htmlFor="project-name">Project Name</FieldLabel>
                        <Input
                            id="project-name"
                            placeholder="e.g. Pengadaan Laptop Operational 2025"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={isSubmitting || !!initialData}
                        />
                        {getFieldErrors("name") && (
                            <p className="text-xs text-red-500 mt-1">{getFieldErrors("name")}</p>
                        )}
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="project-vendor">Vendor</FieldLabel>
                        <Select
                            value={vendorId}
                            onValueChange={(val) => setVendorId(val)}
                            disabled={isSubmitting}
                        >
                            <SelectTrigger id="project-vendor" className="w-full">
                                <SelectValue placeholder="Select vendor..." />
                            </SelectTrigger>
                            <SelectContent>
                                {vendorList.map((vendor) => (
                                    <SelectItem key={vendor.id} value={String(vendor.id)}>
                                        {vendor.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {getFieldErrors("vendorId") && (
                            <p className="text-xs text-red-500 mt-1">{getFieldErrors("vendorId")}</p>
                        )}
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="project-description">Description</FieldLabel>
                        <Textarea
                            id="project-description"
                            placeholder="Optional project description..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            disabled={isSubmitting}
                            rows={3}
                        />
                        {getFieldErrors("description") && (
                            <p className="text-xs text-red-500 mt-1">{getFieldErrors("description")}</p>
                        )}
                    </Field>
                </div>

                <DialogFooter className="mt-2">
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={isSubmitting || !name.trim() || !vendorId}>
                        {isSubmitting ? "Saving..." : initialData ? "Update Project" : "Create Project"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
