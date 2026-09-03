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
import { WorkLocationRepository } from "@/data/repositories/work-location.repository.ts";
import { useFormErrors } from "@/hooks/use-errors.ts";
import type { IErrorResponse } from "@/types/api.type.ts";
import type { ICreateWorkLocationDto, IDetailWorkLocation } from "@/types/work-location.type.ts";
import { useNotificationDialog } from "@/context/NotificationDialogContext.tsx";
import { MapPin } from "lucide-react";

interface LocationDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialData?: IDetailWorkLocation | null;
    onSuccess?: () => void;
}

export const LocationDialog = ({
    open,
    onOpenChange,
    initialData,
    onSuccess,
}: LocationDialogProps) => {
    const { setErrors, clearErrors, getFieldErrors } = useFormErrors();
    const { showNotification } = useNotificationDialog();

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [address, setAddress] = useState("");
    const [latitude, setLatitude] = useState<string>("");
    const [longitude, setLongitude] = useState<string>("");

    useEffect(() => {
        if (open) {
            clearErrors();
            if (initialData) {
                setName(initialData.name || "");
                setDescription(initialData.description || "");
                setAddress(initialData.address || "");
                setLatitude(initialData.latitude != null ? String(initialData.latitude) : "");
                setLongitude(initialData.longitude != null ? String(initialData.longitude) : "");
            } else {
                setName("");
                setDescription("");
                setAddress("");
                setLatitude("");
                setLongitude("");
            }
        }
    }, [open, initialData]);

    const createMutation = useMutation({
        mutationFn: (payload: ICreateWorkLocationDto) => WorkLocationRepository.create(payload),
        onSuccess: () => {
            showNotification({
                variant: "success",
                title: "Location Created",
                description: `Work location "${name}" has been created successfully.`,
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
                    description: error?.message || "Failed to create work location. Please try again.",
                });
            }
        },
    });

    const updateMutation = useMutation({
        mutationFn: (payload: ICreateWorkLocationDto) => WorkLocationRepository.update(initialData!.id, payload),
        onSuccess: () => {
            showNotification({
                variant: "success",
                title: "Location Updated",
                description: `Work location "${name}" has been updated successfully.`,
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
                    description: error?.message || "Failed to update work location. Please try again.",
                });
            }
        },
    });

    const isSubmitting = createMutation.isPending || updateMutation.isPending;

    const handleSubmit = () => {
        clearErrors();

        const payload: ICreateWorkLocationDto = {
            name,
            description,
            address,
            latitude: latitude ? parseFloat(latitude) : undefined,
            longitude: longitude ? parseFloat(longitude) : undefined,
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
                        <MapPin className="w-5 h-5 text-ptba-primary" />
                        {initialData ? "Edit Work Location" : "Add Work Location"}
                    </DialogTitle>
                    <DialogDescription>
                        {initialData
                            ? "Update the details and coordinates for this work location."
                            : "Add a new office, site, or work location to the system."
                        }
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-4 py-2">
                    <Field>
                        <FieldLabel htmlFor="location-name">Location Name</FieldLabel>
                        <Input
                            id="location-name"
                            placeholder="e.g. Kantor Pusat Tanjung Enim"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={isSubmitting}
                        />
                        {getFieldErrors("name") && (
                            <p className="text-xs text-red-500 mt-1">{getFieldErrors("name")}</p>
                        )}
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="location-description">Description</FieldLabel>
                        <Textarea
                            id="location-description"
                            placeholder="Optional description of this site or office..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            disabled={isSubmitting}
                            rows={2}
                        />
                        {getFieldErrors("description") && (
                            <p className="text-xs text-red-500 mt-1">{getFieldErrors("description")}</p>
                        )}
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="location-address">Address</FieldLabel>
                        <Textarea
                            id="location-address"
                            placeholder="Full address of the work location..."
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            disabled={isSubmitting}
                            rows={2}
                        />
                        {getFieldErrors("address") && (
                            <p className="text-xs text-red-500 mt-1">{getFieldErrors("address")}</p>
                        )}
                    </Field>

                    <div className="grid grid-cols-2 gap-4">
                        <Field>
                            <FieldLabel htmlFor="location-latitude">Latitude</FieldLabel>
                            <Input
                                id="location-latitude"
                                type="number"
                                step="any"
                                placeholder="e.g. -3.714289"
                                value={latitude}
                                onChange={(e) => setLatitude(e.target.value)}
                                disabled={isSubmitting}
                            />
                            {getFieldErrors("latitude") && (
                                <p className="text-xs text-red-500 mt-1">{getFieldErrors("latitude")}</p>
                            )}
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="location-longitude">Longitude</FieldLabel>
                            <Input
                                id="location-longitude"
                                type="number"
                                step="any"
                                placeholder="e.g. 103.791550"
                                value={longitude}
                                onChange={(e) => setLongitude(e.target.value)}
                                disabled={isSubmitting}
                            />
                            {getFieldErrors("longitude") && (
                                <p className="text-xs text-red-500 mt-1">{getFieldErrors("longitude")}</p>
                            )}
                        </Field>
                    </div>
                </div>

                <DialogFooter className="mt-2">
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={isSubmitting || !name.trim()}>
                        {isSubmitting ? "Saving..." : initialData ? "Update Location" : "Create Location"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
