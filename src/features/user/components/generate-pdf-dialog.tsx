import {useEffect, useRef, useState} from "react";
import SignatureCanvas from "react-signature-canvas";
import {Button} from "@/components/ui/button";
import {CheckCircle2, Eraser, Save} from "lucide-react";
import {TicketRepository} from "@/data/repositories/ticket.repository.ts";
import type {ITicket, IPrintTicketPayload} from "@/types/ticket.type.ts";
import type {IDetailAssetAssignment} from "@/types/asset-assignment.type.ts";
import {AssetAssignmentRepository} from "@/data/repositories/asset-assignment.repository.ts";
import {Label} from "@/components/ui/label.tsx";
import {Switch} from "@/components/ui/switch.tsx";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import {useGeneratePdf} from "@/features/ticket/hooks/use-generate-pdf.ts";
import {useSaveSignature} from "@/features/ticket/hooks/use-save-signature.ts";
import {DialogContainer} from "@/components/dialog-container.tsx";
import {useLoading} from "@/context/LoadingContext.tsx";
import {EntityCombobox} from "@/components/entity-combobox.tsx";
import {useGetSupervisors} from "@/features/user/hooks/use-get-supervisors.ts";
import type {IDetailUser} from "@/types/user.type.ts";
import {FieldInputWrapper} from "@/components/field-input-wrapper.tsx";
import {useFormErrors} from "@/hooks/use-errors.ts";


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
    const [eSignSupervisor, setESignSupervisor] = useState<boolean>(false)
    const [eSignEngineer, setESignEngineer] = useState<boolean>(false)
    const [eSignUser, setESignUser] = useState<boolean>(false)
    const [savedSignaturePreview, setSavedSignaturePreview] = useState<string | null>(null)
    const [selectedSupervisor, setSelectedSupervisor] = useState<IDetailUser | null>(null)
    const sigCanvasRef = useRef<SignatureCanvas | null>(null)
    const {setErrors, getFieldErrors} = useFormErrors()
    const {showLoading, hideLoading} = useLoading()

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

    const {data: supervisors} = useGetSupervisors()
    useEffect(() => {
	if (supervisors && supervisors.length > 0 && !selectedSupervisor) {
	    setSelectedSupervisor(supervisors[0])
	}
    }, [supervisors, selectedSupervisor])

    const {mutateAsync: saveSignature, isPending: saveSignaturePending} = useSaveSignature()
    const handleSaveSignature = async () => {
	await saveSignature({
	    sigCanvasRef,
	    data: data,
	    setSavedSignaturePreview,
	    type,
	    isTicketData,
	})
    }

    const {mutateAsync: generatePdf, isPending: generatePdfPending} = useGeneratePdf()

    useEffect(() => {
	if (generatePdfPending) {
	    showLoading()
	} else {
	    hideLoading()
	}
    }, [generatePdfPending]);

    const handleGenerate = async () => {
	if (!selectedSupervisor) {
	    setErrors([{
		field: "supervisor",
		message: ["Please select supervisor first"]
	    }])
	    return;
	}

	const payload: IPrintTicketPayload = {
	    eSignSupervisor,
	    eSignEngineer,
	    eSignUser,
	    supervisorId: selectedSupervisor.id,
	};

	await generatePdf({
	    isTicket: isTicketData(data),
	    id: data.id,
	    payload,
	    type
	})
    }

    const handleClearCanvasOrPreview = () => {
	setSavedSignaturePreview(null);
	if (sigCanvasRef.current) {
	    sigCanvasRef.current.clear();
	}
    }

    const disableESign = () => {
	if (isTicketData(data)) {
	    return !data.approvedBy;
	} else {
	    if (data.isLegacyData) {
		return false
	    }
	    if (type === 'assign') {
		return !data.assignTicket?.approvedBy;
	    } else {
		return !data.returnTicket?.approvedBy;
	    }
	}
    }

    const dialogTitle = isTicketData(data) ? "Generate Ticket PDF" : `Generate ${type === 'assign' ? 'Assignment' : 'Return'} Asset PDF`;

    return (

	<DialogContainer
	    title={`${dialogTitle}`}
	    description={"Select signature options to include in the PDF document"}
	    open={open}
	    setOpen={onOpenChange}
	    onContinue={() => handleGenerate()}
	>
	    <div>


		<FieldInputWrapper label={"Signature Information"}>
		    <div className="flex flex-col gap-4 py-2">
			<div className="flex flex-col gap-3 rounded-lg border border-slate-200 p-4 bg-slate-50">
			    <div className="flex items-center justify-between">
				<Label htmlFor="esign-supervisor" className="text-sm font-medium text-slate-700 cursor-pointer">
				    eSign Supervisor
				</Label>
				<Tooltip>
				    <TooltipTrigger asChild>
					<span>
					    <Switch
						id="esign-supervisor"
						checked={eSignSupervisor}
						onCheckedChange={setESignSupervisor}
						disabled={disableESign()}
					    />
					</span>
				    </TooltipTrigger>
				    {disableESign() && (
					<TooltipContent>
					    {`Approve ticket no. ${isTicketData(data) ? data.fullNumber : type === "assign" ? data.assignFullTicketNumber : data.returnFullTicketNumber} first`}
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
                                            <span
						className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                                                <CheckCircle2 className="size-3.5"/> Saved Signature Preview:
                                            </span>
						<Button
						    type="button"
						    variant="ghost"
						    size="sm"
						    className="h-7 text-xs text-red-500 hover:text-red-600 hover:bg-red-50"
						    onClick={handleClearCanvasOrPreview}
						>
						    <Eraser className="size-3.5 mr-1"/> Redo
						</Button>
					    </div>
					    <div
						className="bg-white border border-emerald-300 rounded-md p-3 flex items-center justify-center shadow-inner">
						<img
						    src={savedSignaturePreview}
						    alt="User Signature Preview"
						    className="max-h-30 object-contain"
						/>
					    </div>
					</div>
				    ) : (
					<div className="flex flex-col gap-1.5">
					    <div className="flex justify-between items-center">
					<span
					    className="text-xs text-slate-500 font-medium">Draw signature on canvas:</span>
						<div className="flex items-center gap-1">
						    <Button
							type="button"
							variant="ghost"
							size="sm"
							className="h-7 text-xs text-red-500 hover:text-red-600 hover:bg-red-50"
							onClick={handleClearCanvasOrPreview}
						    >
							<Eraser className="size-3.5 mr-1"/> Clear
						    </Button>
						    <Button
							type="button"
							size="sm"
							className="h-7 text-xs bg-ptba-primary-navy hover:bg-ptba-primary-navy/90 text-white"
							onClick={() => handleSaveSignature()}
							disabled={saveSignaturePending}
						    >
							<Save className="size-3.5 mr-1"/>
							{saveSignaturePending ? "Saving..." : "Save Signature"}
						    </Button>
						</div>
					    </div>
					    <div
						className="bg-white border border-slate-300 rounded-md overflow-hidden shadow-inner">
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
					    <p className="text-[11px] text-slate-400 italic">* Draw signature in canvas area
						then click Save Signature before Generate PDF</p>
					</div>
				    )}
				</div>
			    )}
			</div>
		    </div>
		</FieldInputWrapper>
		{disableESign() &&
                    <FieldInputWrapper label={"Supervisor"} errors={getFieldErrors("supervisor")}>
                        <EntityCombobox<IDetailUser>
                            items={supervisors ?? []}
                            value={selectedSupervisor}
                            getKey={(spv) => spv.id}
                            getLabel={(spv) => `${spv.fullName}`}
                            getSearchValue={(spv) => `${spv.fullName} - ${spv.workLocation.name}`}
                            getTitle={(spv) => `${spv.fullName}`}
			    getDescription={(spv) =>  `${spv.workLocation.name} - ${spv.active ? "Active" : "Inactive"}`}
                            onSelect={setSelectedSupervisor}
			    disabled={!disableESign()}
                        />
                    </FieldInputWrapper>
		}
	    </div>
	</DialogContainer>
    )
}



