import { type ITicket, type IUpdateTicketPayload, TicketStatus } from "@/types/ticket.type.ts";
import { FileText, Info, Laptop } from "lucide-react";
import { useState } from "react";
import { useFormErrors } from "@/hooks/use-errors.tsx";
import { TicketRepository } from "@/data/repositories/ticket.repository.ts";
import type { IErrorResponse } from "@/types/api.type.ts";
import { useNotificationDialog } from "@/context/NotificationDialogContext.tsx";
import { TextAreaField } from "@/components/textarea-field.tsx";
import { AlertDialogContainer } from "@/components/alert-dialog-container.tsx";
import { InputSelect } from "@/components/input-select.tsx";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AssetRepository } from "@/data/repositories/asset.repository.ts";
import { Switch } from "@/components/ui/switch.tsx";
import type { IAsset } from "@/types/asset.type.ts";
import { EntityCombobox } from "@/components/entity-combobox.tsx";
import { FieldInputWrapper } from "@/components/field-input-wrapper.tsx";

interface ITicketPopoverProps {
	open: boolean
	setOpen: (open: boolean) => void
	ticket: ITicket
}

export const CloseTicketDialog = ({ open, setOpen, ticket }: ITicketPopoverProps) => {

	const { showNotification } = useNotificationDialog()

	const [solution, setSolution] = useState<string>(ticket?.solution || "")
	const [selectedStatus, setSelectedStatus] = useState<string>(TicketStatus.ClosedOnsite)
	const { setErrors, getFieldErrors } = useFormErrors()
	const [needBackup, setNeedBackup] = useState<boolean>(false)
	const [selectedAsset, setSelectedAsset] = useState<IAsset | null>(null)

	const { data: assets } = useQuery({
		queryKey: ["assets"],
		queryFn: AssetRepository.getBackupAssets,
		enabled: needBackup,
	})

	const closedTicketStatus = [
		{ label: 'Closed Remote', value: 'closed remote' },
		{ label: 'Closed Visit', value: 'closed visit' },
		{ label: 'Closed Onsite', value: 'closed onsite' },
		{ label: 'Resolved', value: 'resolved' },
	]

	const closeTicket = async () => {

		if (!solution) {
			setErrors([{
				field: 'solution',
				message: ['please submit solution']
			}])
			return
		}

		const ticketData: IUpdateTicketPayload = {
			status: selectedStatus,
			solution: solution,
			solvedAt: new Date().toISOString(),
			backupAssetTag: needBackup ? selectedAsset?.assetTag : undefined,
		}
		closeTicketMutation.mutate(ticketData)
	}

	const closeTicketMutation = useMutation({
		mutationFn: (payload: IUpdateTicketPayload) => TicketRepository.updateTicket(ticket.id, payload),
		onSuccess: () => {
			showNotification({
				variant: "success",
				title: "Ticket has been closed",
				description: "Ticket has been closed successfully",
				onClose: () => window.location.reload(),
			})
		},
		onError: (err: IErrorResponse) => {
			setErrors(err.errors)
		},
	})

	return (
		<AlertDialogContainer title="Close Ticket" description={""} open={open} setOpen={setOpen} onContinue={() => closeTicket()}>
			<div className="space-y-3">
				<TextAreaField
					label="Solution"
					Icon={FileText}
					value={solution}
					onChange={(e) => setSolution(e.target.value)}
					errors={getFieldErrors("solution")}
				/>
				<InputSelect
					label={"Status"}
					Icon={Info}
					value={selectedStatus}
					items={closedTicketStatus}
					onChange={(value) => setSelectedStatus(value)}
					errors={getFieldErrors("status")}
				/>
				<div className="flex items-center">
					<Switch id="needBackup" checked={needBackup} onCheckedChange={(checked: boolean) => setNeedBackup(checked)} />
					<label htmlFor="needBackup" className="ml-2 text-sm font-medium text-ptba-primary-navy">Need Backup</label>
				</div>

				{
					needBackup &&
					<FieldInputWrapper label={"Asset"} Icon={Laptop} errors={getFieldErrors("asset")}>
						<EntityCombobox<IAsset>
							items={assets ?? []}
							value={selectedAsset}
							getKey={(e) => e.assetTag}
							getLabel={(e) => `${e.assetTag} | ${e.type}`}
							getSearchValue={(e) => `${e.assetTag} ${e.type}`}
							getTitle={(e) => e.assetTag}
							getDescription={(e) => `${e.type}`}
							onSelect={(asset) => {
								setSelectedAsset(asset)
							}}
							onClear={() => {
								setSelectedAsset(null)
							}}
						/>
					</FieldInputWrapper>
				}
			</div>
		</AlertDialogContainer>
	)
}