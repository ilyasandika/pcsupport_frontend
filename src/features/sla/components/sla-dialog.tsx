import { useState, useEffect } from "react";
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
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx";
import { Checkbox } from "@/components/ui/checkbox.tsx";
import { SlaPolicyRepository } from "@/data/repositories/sla-policy.repository.ts";
import { useFormErrors } from "@/hooks/use-errors.tsx";
import type { IErrorResponse } from "@/types/api.type.ts";
import type { ISlaPolicy } from "@/types/sla.type.ts";
import { useNotificationDialog } from "@/context/NotificationDialogContext.tsx";
import { ShieldCheck } from "lucide-react";

interface SlaDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialData?: ISlaPolicy | null;
    onSuccess?: () => void;
}

export const SlaDialog = ({
    open,
    onOpenChange,
    initialData,
    onSuccess,
}: SlaDialogProps) => {
    const { setErrors, clearErrors, getFieldErrors } = useFormErrors();
    const { showNotification } = useNotificationDialog();

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState<"low" | "normal" | "medium" | "high">("normal");

    // Hours and Minutes for Response & Resolution
    const [responseHours, setResponseHours] = useState<string>("1");
    const [responseMins, setResponseMins] = useState<string>("0");
    const [resolutionHours, setResolutionHours] = useState<string>("24");
    const [resolutionMins, setResolutionMins] = useState<string>("0");

    const [isBusinessHourOnly, setIsBusinessHourOnly] = useState(true);
    const [isDefault, setIsDefault] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (open) {
            clearErrors();
            if (initialData) {
                setName(initialData.name || "");
                setDescription(initialData.description || "");
                setPriority(initialData.priority || "normal");

                const rSecs = initialData.responseTimeSeconds || 0;
                setResponseHours(String(Math.floor(rSecs / 3600)));
                setResponseMins(String(Math.floor((rSecs % 3600) / 60)));

                const resSecs = initialData.resolutionTimeSeconds || 0;
                setResolutionHours(String(Math.floor(resSecs / 3600)));
                setResolutionMins(String(Math.floor((resSecs % 3600) / 60)));

                setIsBusinessHourOnly(Boolean(initialData.isBusinessHourOnly));
                setIsDefault(Boolean(initialData.isDefault));
            } else {
                setName("");
                setDescription("");
                setPriority("normal");
                setResponseHours("1");
                setResponseMins("0");
                setResolutionHours("24");
                setResolutionMins("0");
                setIsBusinessHourOnly(true);
                setIsDefault(false);
            }
        }
    }, [open, initialData]);

    const handleSubmit = async () => {
        setIsSubmitting(true);
        clearErrors();

        const responseTimeSeconds = (parseInt(responseHours || "0", 10) * 3600) + (parseInt(responseMins || "0", 10) * 60);
        const resolutionTimeSeconds = (parseInt(resolutionHours || "0", 10) * 3600) + (parseInt(resolutionMins || "0", 10) * 60);

        const payload = {
            name,
            description,
            priority,
            responseTimeSeconds,
            resolutionTimeSeconds,
            isBusinessHourOnly,
            isDefault,
        };

        try {
            if (initialData) {
                await SlaPolicyRepository.update(initialData.id, payload);
                showNotification({
                    variant: "success",
                    title: "SLA Policy Updated",
                    description: `SLA policy "${name}" has been updated successfully.`,
                });
            } else {
                await SlaPolicyRepository.create(payload);
                showNotification({
                    variant: "success",
                    title: "SLA Policy Created",
                    description: `SLA policy "${name}" has been created successfully.`,
                });
            }
            onOpenChange(false);
            onSuccess?.();
        } catch (error) {
            const err = error as IErrorResponse;
            if (err && err.errors) {
                setErrors(err.errors);
            } else {
                showNotification({
                    variant: "error",
                    title: "Action Failed",
                    description: err?.message || "Failed to save SLA policy. Please try again.",
                });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-ptba-primary" />
                        {initialData ? "Edit SLA Policy" : "Add SLA Policy"}
                    </DialogTitle>
                    <DialogDescription>
                        Configure response and resolution target times for support tickets.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-4 py-2">
                    <Field>
                        <FieldLabel htmlFor="sla-name">Policy Name</FieldLabel>
                        <Input
                            id="sla-name"
                            placeholder="e.g. Standard SLA - Normal Priority"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={isSubmitting}
                        />
                        {getFieldErrors("name") && (
                            <p className="text-xs text-red-500 mt-1">{getFieldErrors("name")}</p>
                        )}
                    </Field>

                    <div className="grid grid-cols-2 gap-4">
                        <Field>
                            <FieldLabel htmlFor="sla-priority">Priority Target</FieldLabel>
                            <Select
                                value={priority}
                                onValueChange={(val) => setPriority(val as any)}
                                disabled={isSubmitting}
                            >
                                <SelectTrigger id="sla-priority">
                                    <SelectValue placeholder="Select priority" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="low">Low Priority</SelectItem>
                                    <SelectItem value="normal">Normal Priority</SelectItem>
                                    <SelectItem value="medium">Medium Priority</SelectItem>
                                    <SelectItem value="high">High Priority</SelectItem>
                                </SelectContent>
                            </Select>
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="sla-description">Description</FieldLabel>
                            <Textarea
                                id="sla-description"
                                placeholder="Brief note about target..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                disabled={isSubmitting}
                                rows={1}
                            />
                        </Field>
                    </div>

                    <div className="grid grid-cols-2 gap-4 bg-gray-50 p-3 rounded-md border border-gray-200">
                        <div>
                            <FieldLabel className="text-xs font-semibold mb-1 block text-gray-700">
                                Target Response Time
                            </FieldLabel>
                            <div className="flex gap-2 items-center">
                                <div className="flex-1">
                                    <Input
                                        type="number"
                                        min="0"
                                        placeholder="Hours"
                                        value={responseHours}
                                        onChange={(e) => setResponseHours(e.target.value)}
                                        disabled={isSubmitting}
                                    />
                                    <span className="text-[10px] text-gray-500 mt-0.5 block">Hours</span>
                                </div>
                                <div className="flex-1">
                                    <Input
                                        type="number"
                                        min="0"
                                        max="59"
                                        placeholder="Mins"
                                        value={responseMins}
                                        onChange={(e) => setResponseMins(e.target.value)}
                                        disabled={isSubmitting}
                                    />
                                    <span className="text-[10px] text-gray-500 mt-0.5 block">Minutes</span>
                                </div>
                            </div>
                            {getFieldErrors("responseTimeSeconds") && (
                                <p className="text-xs text-red-500 mt-1">{getFieldErrors("responseTimeSeconds")}</p>
                            )}
                        </div>

                        <div>
                            <FieldLabel className="text-xs font-semibold mb-1 block text-gray-700">
                                Target Resolution Time
                            </FieldLabel>
                            <div className="flex gap-2 items-center">
                                <div className="flex-1">
                                    <Input
                                        type="number"
                                        min="0"
                                        placeholder="Hours"
                                        value={resolutionHours}
                                        onChange={(e) => setResolutionHours(e.target.value)}
                                        disabled={isSubmitting}
                                    />
                                    <span className="text-[10px] text-gray-500 mt-0.5 block">Hours</span>
                                </div>
                                <div className="flex-1">
                                    <Input
                                        type="number"
                                        min="0"
                                        max="59"
                                        placeholder="Mins"
                                        value={resolutionMins}
                                        onChange={(e) => setResolutionMins(e.target.value)}
                                        disabled={isSubmitting}
                                    />
                                    <span className="text-[10px] text-gray-500 mt-0.5 block">Minutes</span>
                                </div>
                            </div>
                            {getFieldErrors("resolutionTimeSeconds") && (
                                <p className="text-xs text-red-500 mt-1">{getFieldErrors("resolutionTimeSeconds")}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 pt-1">
                        <label className="flex items-center gap-2.5 text-sm cursor-pointer select-none">
                            <Checkbox
                                checked={isBusinessHourOnly}
                                onCheckedChange={(checked) => setIsBusinessHourOnly(Boolean(checked))}
                                disabled={isSubmitting}
                            />
                            <span className="text-gray-700">Count only during Business Hours (08.00 - 17.00)</span>
                        </label>

                        <label className="flex items-center gap-2.5 text-sm cursor-pointer select-none">
                            <Checkbox
                                checked={isDefault}
                                onCheckedChange={(checked) => setIsDefault(Boolean(checked))}
                                disabled={isSubmitting}
                            />
                            <span className="text-gray-700 font-medium">Set as Default SLA Policy</span>
                        </label>
                    </div>
                </div>

                <DialogFooter className="mt-2">
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={isSubmitting || !name.trim()}>
                        {isSubmitting ? "Saving..." : initialData ? "Update Policy" : "Create Policy"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
