import {type ICloseTicket, type ITicket, TicketStatus} from "@/types/ticket.type.ts";
import {FileText, Info, Laptop} from "lucide-react";
import {useEffect, useState} from "react";
import {useFormErrors} from "@/hooks/use-errors.ts";
import type {IErrorResponse} from "@/types/api.type.ts";
import {TextAreaField} from "@/components/textarea-field.tsx";
import {DialogContainer} from "@/components/dialog-container.tsx";
import {InputSelect} from "@/components/input-select.tsx";
import {Switch} from "@/components/ui/switch.tsx";
import type {IAsset} from "@/types/asset.type.ts";
import {EntityCombobox} from "@/components/entity-combobox.tsx";
import {FieldInputWrapper} from "@/components/field-input-wrapper.tsx";
import {useGetBackupAssets} from "@/features/asset/hooks/use-get-assets.ts";
import {useCloseTicket} from "@/features/ticket/hooks/use-close-ticket.ts";

interface ITicketPopoverProps {
    open: boolean
    setOpen: (open: boolean) => void
    ticket: ITicket
}

export const CloseTicketDialog = ({open, setOpen, ticket}: ITicketPopoverProps) => {
    const [solution, setSolution] = useState<string>(ticket?.solution || "")
    const [selectedStatus, setSelectedStatus] = useState<string>(TicketStatus.ClosedOnsite)
    const {setErrors, getFieldErrors} = useFormErrors()
    const [needBackup, setNeedBackup] = useState<boolean>(false)
    const [selectedAsset, setSelectedAsset] = useState<IAsset | null>(null)
    const [assetFilter, setAssetFilter] = useState<string>("")
    const [debounceAssetFilter, setDebounceAssetFilter] = useState<string>("")

    useEffect(() => {
	const timer = setTimeout(() => {
	    setDebounceAssetFilter(assetFilter)
	}, 500)
	return () => clearTimeout(timer)
    }, [assetFilter])

    const {data: assets} = useGetBackupAssets({
	asset: debounceAssetFilter,
    })
    const {mutateAsync: closeTicketMutate} = useCloseTicket()


    const closedTicketStatus = [
	{label: 'Closed Remote', value: 'closed remote'},
	{label: 'Closed Visit', value: 'closed visit'},
	{label: 'Closed Onsite', value: 'closed onsite'},
	{label: 'Resolved', value: 'resolved'},
    ]

    const closeTicket = async () => {
	const ticketData: ICloseTicket = {
	    status: selectedStatus,
	    solution: solution,
	    backupAssetTag: needBackup ? selectedAsset?.assetTag : undefined,
	}
	try {
	    await closeTicketMutate({id: ticket.id, payload: ticketData})
	} catch (err) {
	    const errorResponse = err as IErrorResponse;
	    setErrors(errors => [...errors, ...errorResponse.errors])
	}
    }

    return (
	<DialogContainer type="dialog" title="Close Ticket" description={""} open={open} setOpen={setOpen}
			 onContinue={() => closeTicket()}>
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
		{
		    ticket.asset?.assetTag &&
                    <div className="flex items-center">
                        <Switch id="needBackup" checked={needBackup}
                                onCheckedChange={(checked: boolean) => setNeedBackup(checked)}/>
                        <label htmlFor="needBackup" className="ml-2 text-sm font-medium text-ptba-primary-navy">Need
                            Backup</label>
                    </div>
		}

		{
		    needBackup &&
                    <FieldInputWrapper label={"Asset"} Icon={Laptop} errors={getFieldErrors("asset")}>
                        <EntityCombobox<IAsset>
                            items={assets?.data ?? []}
                            value={selectedAsset}
			    onInputValueChange={(value) => setAssetFilter(value)}
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
	</DialogContainer>
    )
}