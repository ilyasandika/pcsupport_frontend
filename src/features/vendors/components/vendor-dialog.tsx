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
import { Field, FieldLabel } from "@/components/ui/field.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx";
import { VendorRepository } from "@/data/repositories/vendor.repository.ts";
import { useFormErrors } from "@/hooks/use-errors.ts";
import type { IErrorResponse } from "@/types/api.type.ts";
import type { IVendor, IVendorContact, IVendorPayload } from "@/types/vendor.type.ts";
import { useNotificationDialog } from "@/context/NotificationDialogContext.tsx";
import { Building2, Plus, Trash2, PhoneCall } from "lucide-react";

interface VendorDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialData?: IVendor | null;
    onSuccess?: () => void;
}

const DEFAULT_CONTACT_TYPES = ["Phone", "Email", "WhatsApp", "Call Center", "Contact Person", "Website", "Other"];

export const VendorDialog = ({
    open,
    onOpenChange,
    initialData,
    onSuccess,
}: VendorDialogProps) => {
    const { setErrors, clearErrors, getFieldErrors } = useFormErrors();
    const { showNotification } = useNotificationDialog();

    const [name, setName] = useState("");
    const [contacts, setContacts] = useState<IVendorContact[]>([]);

    useEffect(() => {
        if (open) {
            clearErrors();
            if (initialData) {
                setName(initialData.name || "");
                setContacts(initialData.contacts && initialData.contacts.length > 0
                    ? initialData.contacts.map(c => ({ ...c }))
                    : []
                );
            } else {
                setName("");
                setContacts([]);
            }
        }
    }, [open, initialData]);

    const createMutation = useMutation({
        mutationFn: (payload: IVendorPayload) => VendorRepository.create(payload),
        onSuccess: () => {
            showNotification({
                variant: "success",
                title: "Vendor Created",
                description: `Vendor "${name}" has been created successfully.`,
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
                    description: error?.message || "Failed to create vendor. Please try again.",
                });
            }
        },
    });

    const updateMutation = useMutation({
        mutationFn: (payload: IVendorPayload) => VendorRepository.update(initialData!.id, payload),
        onSuccess: () => {
            showNotification({
                variant: "success",
                title: "Vendor Updated",
                description: `Vendor "${name}" has been updated successfully.`,
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
                    description: error?.message || "Failed to update vendor. Please try again.",
                });
            }
        },
    });

    const isSubmitting = createMutation.isPending || updateMutation.isPending;

    const handleAddContact = () => {
        setContacts(prev => [...prev, { type: "Phone", value: "" }]);
    };

    const handleRemoveContact = (index: number) => {
        setContacts(prev => prev.filter((_, i) => i !== index));
    };

    const handleContactChange = (index: number, field: keyof IVendorContact, val: string) => {
        setContacts(prev => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: val };
            return updated;
        });
    };

    const handleSubmit = () => {
        if (!name.trim()) return;
        clearErrors();

        const validContacts = contacts
            .map(c => ({ type: c.type.trim() || "Other", value: c.value.trim() }))
            .filter(c => c.value.length > 0);

        const payload: IVendorPayload = {
            name: name.trim(),
            contacts: validContacts,
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
                        <Building2 className="w-5 h-5 text-ptba-primary" />
                        {initialData ? "Edit Vendor" : "Add Vendor"}
                    </DialogTitle>
                    <DialogDescription>
                        {initialData
                            ? "Update vendor details and support contact channels."
                            : "Add a new vendor or equipment supplier and their support contacts."
                        }
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-4 py-2 max-h-[60vh] overflow-y-auto pr-1">
                    <Field>
                        <FieldLabel htmlFor="vendor-name">Vendor Name</FieldLabel>
                        <Input
                            id="vendor-name"
                            placeholder="e.g. PT Lenovo Indonesia"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={isSubmitting}
                        />
                        {getFieldErrors("name") && (
                            <p className="text-xs text-red-500 mt-1">{getFieldErrors("name")}</p>
                        )}
                    </Field>

                    {/* Support Contacts Section */}
                    <div className="space-y-3 pt-2 border-t">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 font-medium text-sm text-gray-800">
                                <PhoneCall className="w-4 h-4 text-ptba-primary" />
                                <span>Support Contacts</span>
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={handleAddContact}
                                disabled={isSubmitting}
                                className="h-8 text-xs flex items-center gap-1"
                            >
                                <Plus className="w-3.5 h-3.5" /> Add Contact
                            </Button>
                        </div>

                        {contacts.length === 0 ? (
                            <p className="text-xs text-gray-500 italic py-1 text-center bg-gray-50 rounded border border-dashed">
                                No support contacts added yet. Click "+ Add Contact" to add phone numbers, email addresses, etc.
                            </p>
                        ) : (
                            <div className="space-y-2">
                                {contacts.map((contact, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <div className="w-36 shrink-0">
                                            <Select
                                                value={contact.type}
                                                onValueChange={(val) => handleContactChange(index, "type", val)}
                                                disabled={isSubmitting}
                                            >
                                                <SelectTrigger className="h-9 text-xs">
                                                    <SelectValue placeholder="Select type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {DEFAULT_CONTACT_TYPES.map(type => (
                                                        <SelectItem key={type} value={type} className="text-xs">
                                                            {type}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <Input
                                            className="h-9 text-xs flex-1"
                                            placeholder={
                                                contact.type === "Email" ? "e.g. support@lenovo.com" :
                                                contact.type === "Phone" || contact.type === "WhatsApp" ? "e.g. 021-50880000" :
                                                "e.g. Contact detail / link"
                                            }
                                            value={contact.value}
                                            onChange={(e) => handleContactChange(index, "value", e.target.value)}
                                            disabled={isSubmitting}
                                        />

                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleRemoveContact(index)}
                                            disabled={isSubmitting}
                                            className="h-9 w-9 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 shrink-0"
                                            title="Remove contact"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <DialogFooter className="mt-2">
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={isSubmitting || !name.trim()}>
                        {isSubmitting ? "Saving..." : initialData ? "Update Vendor" : "Create Vendor"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
