import {useEffect, useState} from "react";
import {InputText} from "@/components/input-text.tsx";
import {CalendarDays, MessageSquare, User} from "lucide-react";
import {AssetAssignmentRepository} from "@/data/repositories/asset-assignment.repository.ts";
import {useFormErrors} from "@/hooks/use-errors.ts";
import {useNotificationDialog} from "@/context/NotificationDialogContext.tsx";
import {capitalizeWords, getLocalDatetime} from "@/helper/helper.tsx";
import {DialogContainer} from "@/components/dialog-container.tsx";
import {EntityCombobox} from "@/components/entity-combobox.tsx";
import {FieldInputWrapper} from "@/components/field-input-wrapper.tsx";
import type {IUser} from "@/types/user.type.ts";
import {useMutation, useQuery} from "@tanstack/react-query";
import {UserRepository} from "@/data/repositories/user.repository.ts";
import type {IReturnAssetAssignmentPayload} from "@/types/asset-assignment.type.ts";
import type {IErrorResponse} from "@/types/api.type.ts";
import {useAuth} from "@/context/AuthContext.tsx";

interface ReturnAssetDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    assignmentId: number;
    onSuccess?: () => void;
}

export const ReturnAssetDialog = ({open, onOpenChange, assignmentId}: ReturnAssetDialogProps) => {
    const {showNotification} = useNotificationDialog()
    const {setErrors, getFieldErrors} = useFormErrors()
    const {user} = useAuth()


    const {data: engineers = []} = useQuery({
	queryKey: ["engineer"],
	queryFn: UserRepository.getUsers,
	enabled: open,
    })

    const [returnedAt, setReturnedAt] = useState(getLocalDatetime() || "");
    const [selectedEngineer, setSelectedEngineer] = useState<IUser | null>(null);

    useEffect(() => {
	setSelectedEngineer(engineers.find((val) => val.id === user?.sub) || null)
    }, [engineers])


    const [remarks, setRemarks] = useState("")
    const returnMutation = useMutation({
	mutationFn: ({id, payload}: {
	    id: number,
	    payload: IReturnAssetAssignmentPayload
	}) => AssetAssignmentRepository.returnAssignment(id, payload),
	onSuccess: () => {
	    resetForm()
	    showNotification({
		variant: "success",
		title: "Asset successfully returned",
		description: "Assignment has been closed",
	    })
	},
	onError: (err: IErrorResponse) => {
	    setErrors(err.errors)
	}
    })

    const resetForm = () => {
	setReturnedAt("")
	setRemarks("")
    }

    const handleSubmit = async (id: number) => {
	if (selectedEngineer) {
	    returnMutation.mutate({
		id: id, payload: {
		    returnedAt: new Date(returnedAt).toISOString(),
		    remarks: remarks || undefined,
		    engineerId: selectedEngineer?.id,
		}
	    })
	}
    }

    return (
	<DialogContainer open={open} title={"Return Asset"} setOpen={onOpenChange}
			 description={"Marking this asset as returned"} onContinue={() => handleSubmit(assignmentId)}>
	    <div className="flex flex-col gap-4 py-2">
		<InputText
		    label="Return Date"
		    id="returnedAt"
		    Icon={CalendarDays}
		    type="datetime-local"
		    value={returnedAt}
		    onChange={(e) => setReturnedAt(e.target.value)}
		    errors={getFieldErrors("returnedAt")}
		/>
		<FieldInputWrapper Icon={User} label={"Engineer"} errors={getFieldErrors("assignById")}>
		    <EntityCombobox<IUser>
			items={engineers}
			value={selectedEngineer ?? null}
			getKey={(e) => e.id}
			getLabel={(e) => e.fullName}
			getSearchValue={(e) => `${e.fullName} | ${e.role} | ${e.workLocation.name}`}
			getTitle={(e) => e.fullName}
			getDescription={(e) => `${capitalizeWords(e.role)} | ${e.workLocation.name}`}
			onSelect={setSelectedEngineer}
			onClear={() => setSelectedEngineer(null)}
		    />
		</FieldInputWrapper>
		<InputText
		    label="Remarks (optional)"
		    id="remarks"
		    Icon={MessageSquare}
		    value={remarks}
		    onChange={(e) => setRemarks(e.target.value)}
		    errors={getFieldErrors("remarks")}
		/>
	    </div>
	</DialogContainer>
    )
}