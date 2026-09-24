import { useMutation } from "@tanstack/react-query";
import { TicketRepository } from "@/data/repositories/ticket.repository";
import { AssetAssignmentRepository } from "@/data/repositories/asset-assignment.repository";
import React from "react";
import type {ITicket} from "@/types/ticket.type.ts";
import type {IDetailAssetAssignment} from "@/types/asset-assignment.type.ts";

interface SaveSignatureParams {
    sigCanvasRef: React.RefObject<any>; // Sesuaikan tipe ref-mu (misal: SignatureCanvas)
    data: ITicket | IDetailAssetAssignment;
    type: "assign" | "return";
    isTicketData: (data: any) => boolean;
    setSavedSignaturePreview: (url: string) => void;
}

export const useSaveSignature = () => {
    return useMutation({
	mutationFn: async ({
			       sigCanvasRef,
			       data,
			       type,
			       isTicketData,
			       setSavedSignaturePreview
			   }: SaveSignatureParams) => {
	    if (!sigCanvasRef.current || sigCanvasRef.current.isEmpty()) {
		throw new Error("Signature is empty");
	    }

	    const dataUrl = sigCanvasRef.current.getCanvas().toDataURL("image/png");
	    const res = await fetch(dataUrl);
	    const blob = await res.blob();
	    const file = new File([blob], `user-signature-${data.id}.png`, { type: "image/png" });

	    let result;
	    if (isTicketData(data)) {
		result = await TicketRepository.uploadUserSignature(data.id, file);
	    } else {
		result = await AssetAssignmentRepository.uploadUserSignature(data.id, file, type);
	    }

	    setSavedSignaturePreview(dataUrl);
	    return { dataUrl, result, blob };
	},
    });
};