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
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldLabel } from "@/components/ui/field";
import { AssetCategoryRepository } from "@/data/repositories/asset-category.repository";
import { useFormErrors } from "@/hooks/use-errors";
import type { IErrorResponse } from "@/types/api.type";
import type { IAssetCategory, ICreateAssetCategoryDto } from "@/types/asset-category.type";
import { useNotificationDialog } from "@/context/NotificationDialogContext";
import { Tags } from "lucide-react";

interface AssetCategoryDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialData?: IAssetCategory | null;
    onSuccess?: () => void;
}

export const AssetCategoryDialog = ({
    open,
    onOpenChange,
    initialData,
    onSuccess,
}: AssetCategoryDialogProps) => {
    const { setErrors, clearErrors, getFieldErrors } = useFormErrors();
    const { showNotification } = useNotificationDialog();

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    useEffect(() => {
        if (open) {
            clearErrors();
            if (initialData) {
                setName(initialData.name || "");
                setDescription(initialData.description || "");
            } else {
                setName("");
                setDescription("");
            }
        }
    }, [open, initialData]);

    const createMutation = useMutation({
        mutationFn: (payload: ICreateAssetCategoryDto) => AssetCategoryRepository.create(payload),
        onSuccess: () => {
            showNotification({
                variant: "success",
                title: "Category Created",
                description: `Asset category "${name}" has been created successfully.`,
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
                    description: error?.message || "Failed to create asset category. Please try again.",
                });
            }
        },
    });

    const updateMutation = useMutation({
        mutationFn: (payload: ICreateAssetCategoryDto) => AssetCategoryRepository.update(initialData!.id, payload),
        onSuccess: () => {
            showNotification({
                variant: "success",
                title: "Category Updated",
                description: `Asset category "${name}" has been updated successfully.`,
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
                    description: error?.message || "Failed to update asset category. Please try again.",
                });
            }
        },
    });

    const isSubmitting = createMutation.isPending || updateMutation.isPending;

    const handleSubmit = () => {
        clearErrors();

        const payload: ICreateAssetCategoryDto = {
            name,
            description,
        };

        if (initialData) {
            updateMutation.mutate(payload);
        } else {
            createMutation.mutate(payload);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Tags className="w-5 h-5 text-ptba-primary" />
                        {initialData ? "Edit Asset Category" : "Add Asset Category"}
                    </DialogTitle>
                    <DialogDescription>
                        {initialData
                            ? "Update the name and description of this asset category."
                            : "Create a new category for grouping assets and equipment."
                        }
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-4 py-2">
                    <Field>
                        <FieldLabel htmlFor="category-name">Category Name</FieldLabel>
                        <Input
                            id="category-name"
                            placeholder="e.g. Laptop & Notebook"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={isSubmitting}
                        />
                        {getFieldErrors("name") && (
                            <p className="text-xs text-red-500 mt-1">{getFieldErrors("name")}</p>
                        )}
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="category-description">Description</FieldLabel>
                        <Textarea
                            id="category-description"
                            placeholder="Describe what kind of assets belong in this category..."
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
                    <Button onClick={handleSubmit} disabled={isSubmitting || !name.trim()}>
                        {isSubmitting ? "Saving..." : initialData ? "Update Category" : "Create Category"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
