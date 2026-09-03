import { useEffect, useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Eraser, FileText, Save } from "lucide-react";
import { useFormErrors } from "@/hooks/use-errors.ts";
import { TicketRepository } from "@/data/repositories/ticket.repository.ts";
import { useMutation } from "@tanstack/react-query";
import type { IErrorResponse } from "@/types/api.type.ts";
import type { ITicket, IPrintTicketPayload } from "@/types/ticket.type.ts";
import type { IDetailAssetAssignment } from "@/types/asset-assignment.type.ts";
import { AssetAssignmentRepository } from "@/data/repositories/asset-assignment.repository.ts";
import { Label } from "@/components/ui/label.tsx";
import { Switch } from "@/components/ui/switch.tsx";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";


interface GeneratePdfDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    data: ITicket | IDetailAssetAssignment;
    type?: 'assign' | 'return';
}
const isTicketData = (item: ITicket | IDetailAssetAssignment): item is ITicket => {
    return 'engineer' in item;
};

export const GeneratePdfDialog = ({
    open,
    onOpenChange,
    data,
    type = "assign"
}: GeneratePdfDialogProps) => {
    const { setErrors } = useFormErrors()

    const [eSignSupervisor, setESignSupervisor] = useState<boolean>(false)
    const [eSignEngineer, setESignEngineer] = useState<boolean>(false)
    const [eSignUser, setESignUser] = useState<boolean>(false)
    const [savedSignaturePreview, setSavedSignaturePreview] = useState<string | null>(null)

    const sigCanvasRef = useRef<SignatureCanvas | null>(null)

    useEffect(() => {
        let isMounted = true;
        if (open) {
            if (isTicketData(data)) {
                if (data.userSignaturePath) {
                    TicketRepository.getUserSignature(data.id).then((url) => {
                        if (isMounted) {
                            if (url) {
                                setSavedSignaturePreview(url);
                                setESignUser(true);
                            } else {
                                setSavedSignaturePreview(null);
                            }
                        }
                    });
                } else {
                    setSavedSignaturePreview(null);
                }
            } else {
                const sigPath = type === "assign" ? data.assignUserSignaturePath : data.returnUserSignaturePath;
                if (sigPath) {
                    AssetAssignmentRepository.getUserSignature(data.id, type).then((url) => {
                        if (isMounted) {
                            if (url) {
                                setSavedSignaturePreview(url);
                                setESignUser(true);
                            } else {
                                setSavedSignaturePreview(null);
                            }
                        }
                    });
                } else {
                    setSavedSignaturePreview(null);
                }
            }
        }
        return () => {
            isMounted = false;
        };
    }, [open, data, type]);

    const handleCloseDialog = () => {
        onOpenChange(false);
    }

    const saveSignatureMutation = useMutation({
        mutationFn: async () => {
            if (!sigCanvasRef.current || sigCanvasRef.current.isEmpty()) {
                return;
            }
            const dataUrl = sigCanvasRef.current.getCanvas().toDataURL("image/png");
            const res = await fetch(dataUrl);
            const blob = await res.blob();
            const file = new File([blob], `user-signature-${data.id}.png`, { type: "image/png" });
            
            if (isTicketData(data)) {
                await TicketRepository.uploadUserSignature(data.id, file);
            } else {
                await AssetAssignmentRepository.uploadUserSignature(data.id, file, type);
            }
            setSavedSignaturePreview(dataUrl);
        },
        onError: (error: any) => {
            console.error("Error saving signature:", error);
        },
    })

    const generateMutation = useMutation({
        mutationFn: async () => {
            const payload: IPrintTicketPayload = {
                eSignSupervisor,
                eSignEngineer,
                eSignUser,
            };
            if (isTicketData(data)) {
                return TicketRepository.generateTicketPdf(data.id, payload);
            } else {
                return AssetAssignmentRepository.generateDocument(data.id, payload, type);
            }
        },
        onError: (error: IErrorResponse) => {
            setErrors(error.errors)
            console.log(error)
        },
        onSuccess: () => {
            onOpenChange(false);
        },
    })

    const handleGenerate = () => {
        generateMutation.mutate()
    }

    const handleClearCanvasOrPreview = () => {
        setSavedSignaturePreview(null);
        if (sigCanvasRef.current) {
            sigCanvasRef.current.clear();
        }
    }

    const dialogTitle = isTicketData(data) ? "Generate Ticket PDF" : `Generate ${type === 'assign' ? 'Assignment' : 'Return'} Asset PDF`;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger />
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>{dialogTitle}</DialogTitle>
                    <DialogDescription>
                        Select signature options to include in the PDF document.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-4 py-2">
                    <div className="flex flex-col gap-3 rounded-lg border border-slate-200 p-4 bg-slate-50">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="esign-supervisor" className="text-sm font-medium text-slate-700 cursor-pointer">
                                eSign Supervisor
                            </Label>
                            <Tooltip>
                                <TooltipTrigger>
                                    <Switch
                                        id="esign-supervisor"
                                        checked={eSignSupervisor}
                                        onCheckedChange={setESignSupervisor}
                                        disabled={isTicketData(data) && !data.approvedBy}
                                    />
                                </TooltipTrigger>
                                {(isTicketData(data) && !data.approvedBy) && (
                                    <TooltipContent>
                                        Ticket has not been approved
                                    </TooltipContent>
                                )}
                            </Tooltip>
                        </div>

                        <div className="flex items-center justify-between">
                            <Label htmlFor="esign-engineer" className="text-sm font-medium text-slate-700 cursor-pointer">
                                eSign Engineer
                            </Label>
                            <Switch
                                id="esign-engineer"
                                checked={eSignEngineer}
                                onCheckedChange={setESignEngineer}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <Label htmlFor="esign-user" className="text-sm font-medium text-slate-700 cursor-pointer">
                                eSign User
                            </Label>
                            <Switch
                                id="esign-user"
                                checked={eSignUser}
                                onCheckedChange={setESignUser}
                            />
                        </div>

                        {eSignUser && (
                            <div className="flex flex-col gap-2 mt-2 pt-3 border-t border-slate-200">
                                {savedSignaturePreview ? (
                                    <div className="flex flex-col gap-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                                                <CheckCircle2 className="size-3.5" /> Saved Signature Preview:
                                            </span>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="h-7 text-xs text-red-500 hover:text-red-600 hover:bg-red-50"
                                                onClick={handleClearCanvasOrPreview}
                                            >
                                                <Eraser className="size-3.5 mr-1" /> Redo
                                            </Button>
                                        </div>
                                        <div className="bg-white border border-emerald-300 rounded-md p-3 flex items-center justify-center shadow-inner">
                                            <img
                                                src={savedSignaturePreview}
                                                alt="User Signature Preview"
                                                className="max-h-[120px] object-contain"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-1.5">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-slate-500 font-medium">Draw signature on canvas:</span>
                                            <div className="flex items-center gap-1">
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-7 text-xs text-red-500 hover:text-red-600 hover:bg-red-50"
                                                    onClick={handleClearCanvasOrPreview}
                                                >
                                                    <Eraser className="size-3.5 mr-1" /> Clear
                                                </Button>
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    className="h-7 text-xs bg-ptba-primary-navy hover:bg-ptba-primary-navy/90 text-white"
                                                    onClick={() => saveSignatureMutation.mutate()}
                                                    disabled={saveSignatureMutation.isPending}
                                                >
                                                    <Save className="size-3.5 mr-1" />
                                                    {saveSignatureMutation.isPending ? "Saving..." : "Save Signature"}
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="bg-white border border-slate-300 rounded-md overflow-hidden shadow-inner">
                                            <SignatureCanvas
                                                ref={sigCanvasRef}
                                                canvasProps={{
                                                    width: 400,
                                                    height: 140,
                                                    className: "sigCanvas cursor-crosshair w-full h-[140px]"
                                                }}
                                                penColor="#0f172a"
                                            />
                                        </div>
                                        <p className="text-[11px] text-slate-400 italic">* Draw signature in canvas area then click Save Signature before Generate PDF</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={handleCloseDialog} disabled={generateMutation.isPending}>
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleGenerate} 
                        disabled={generateMutation.isPending || (eSignUser && !savedSignaturePreview)}
                        title={eSignUser && !savedSignaturePreview ? "Please save signature before generating PDF" : undefined}
                    >
                        <FileText className="size-4 mr-1.5" />
                        {generateMutation.isPending ? "Loading..." : "Generate PDF"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}



