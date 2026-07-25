import {useState} from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
 DialogTrigger} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {InputText} from "@/components/input-text.tsx";
import {
    Field,
    FieldLabel,
    FieldContent,
    FieldDescription,
} from "@/components/ui/field";
import {Asterisk, CalendarDays, MessageSquare, User} from "lucide-react";
import {AssetAssignmentRepository} from "@/data/repositories/asset-assignment.repository.ts";
import {EmployeeRepository} from "@/data/repositories/employee.repository.ts";
import type {IEmployee} from "@/types/employee.type.ts";
import {useFormErrors} from "@/hooks/useErrors.tsx";
import {useNotificationDialog} from "@/context/NotificationDialogContext.tsx";
import {CheckboxBasic} from "@/components/checkbox-basic.tsx";
import {EntityCombobox} from "@/components/entity-combobox.tsx";
import type {IUser} from "@/types/user.type.ts";
import {useMutation, useQuery} from "@tanstack/react-query";
import {UserRepository} from "@/data/repositories/user.repository.ts";
import {capitalizeWords, getLocalDatetime} from "@/helper/helper.tsx";
import type {ICreateAssetAssignmentPayload} from "@/types/asset-assignment.type.ts";
import type {IErrorResponse} from "@/types/api.type.ts";

interface CreateAssetAssignDialog {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    assetTag: string;
    onSuccess?: () => void;
}

export const CreateAssetAssignDialog = ({open, onOpenChange, assetTag, onSuccess}: CreateAssetAssignDialog) => {
    const {showNotification} = useNotificationDialog()
    const {setErrors, getFieldErrors} = useFormErrors()

    const [isBackup, setIsBackup] = useState<boolean>(false)
    const [selectedEmployee, setSelectedEmployee] = useState<IEmployee | null>(null)
    const [selectedEngineer, setSelectedEngineer] = useState<IUser | null>(null)

    const [userNonEmployeeName, setUserNonEmployeeName] = useState("")
    const [assignedAt, setAssignedAt] = useState(getLocalDatetime())
    const [remarks, setRemarks] = useState("")

    const { data: engineers = [] } = useQuery({
	queryKey: ["engineers"],
	queryFn: UserRepository.getUsers,
	enabled: open,
    })

    const { data: employees = [] } = useQuery({
	queryKey: ["employees"],
	queryFn: EmployeeRepository.getEmployeeListForDropdown,
	enabled: open,
    })

    const resetForm = () => {
	setSelectedEmployee(null)
	setUserNonEmployeeName("")
	setAssignedAt("")
	setRemarks("")
    }

    const createAssignmentMutation = useMutation({
	mutationFn: (payload: ICreateAssetAssignmentPayload) => AssetAssignmentRepository.create(payload),
	onSuccess: () => {
	    resetForm()
	    onOpenChange(false)
	    showNotification({
		variant: "success",
		title: "Asset successfully assigned",
		description: "New assignment has been created.",
		onClose: () => onSuccess?.(),
	    })
	},
	onError: (err: IErrorResponse) => {
	    setErrors(err.errors)
	}
    })

    const handleSubmit = () => {
	if (!selectedEmployee) {
	    setErrors([{
		field: 'picEmployeeNik',
		message: ["Please select an employee"],
	    }])
	    return
	}
	if (!selectedEngineer) {
	    setErrors([{
		field: 'assignById',
		message: ["Please select an engineer"],
	    }])
	    return
	}
	createAssignmentMutation.mutate({
	    assetTag,
	    picEmployeeNik: selectedEmployee?.nik,
	    userNonEmployeeName: userNonEmployeeName || undefined,
	    assignedAt,
	    assignById: selectedEngineer?.id,
	    isBackup,
	})
    }

    return (
	<Dialog open={open} onOpenChange={onOpenChange}>
	    <DialogTrigger/>
	    <DialogContent>
		<DialogHeader>
		    <DialogTitle>New Assignment</DialogTitle>
		    <DialogDescription>
			Assign an Employee for  <span className="font-medium">{assetTag}</span>
		    </DialogDescription>
		</DialogHeader>

		<div className="flex flex-col gap-4 py-2">
		    <Field>
			<FieldLabel>
			    <User className="w-4 h-4"/>
			    <div className="flex items-start gap-0.5">
				Employee
				<Asterisk className="text-ptba-primary-red w-3 h-3"/>
			    </div>
			</FieldLabel>
			<FieldContent>
			    <EntityCombobox<IEmployee>
				items={employees}
				value={selectedEmployee}
				getKey={(e) => e.nik}
				getLabel={(e) => `${e.nik} | ${e.name}`}
				getSearchValue={(e) => `${e.nik} ${e.name} ${e.department}`}
				getTitle={(e) => e.name}
				getDescription={(e) => `${e.nik} | ${e.department}`}
				onSelect={(employee) => {
				    setSelectedEmployee(employee)
				}}
				onClear={() => {
				    setSelectedEmployee(null)
				}}
			    />
			</FieldContent>
			<FieldDescription>
			    {getFieldErrors("picEmployeeNik")?.map((error) => (
				<span key={error} className="text-danger">{error}</span>
			    ))}
			</FieldDescription>
		    </Field>

		    <Field>
			<FieldLabel>
			    <User className="w-4 h-4"/>
			    <div className="flex items-start gap-0.5">
				Engineer
				<Asterisk className="text-ptba-primary-red w-3 h-3"/>
			    </div>
			</FieldLabel>
			<FieldContent>
			    <EntityCombobox<IUser>
				items={engineers}
				value={selectedEngineer}
				getKey={(e) => e.id}
				getLabel={(e) => e.fullName}
				getSearchValue={(e) => `${e.fullName} | ${e.role} | ${e.workLocation.name}`}
				getTitle={(e) => e.fullName}
				getDescription={(e) => `${capitalizeWords(e.role)} | ${e.workLocation.name}`}
				onSelect={setSelectedEngineer}
				onClear={() => setSelectedEngineer(null)}
			    />
			</FieldContent>
			<FieldDescription>
			    {getFieldErrors("assignById")?.map((error) => (
				<span key={error} className="text-danger">{error}</span>
			    ))}
			</FieldDescription>
		    </Field>
		    <InputText
			label="Tanggal Assign"
			id="assignedAt"
			Icon={CalendarDays}
			type="datetime-local"
			value={assignedAt}
			onChange={(e) => setAssignedAt(e.target.value)}
			errors={getFieldErrors("assignedAt")}
		    />
		    <InputText
			label="Catatan (opsional)"
			id="remarks"
			Icon={MessageSquare}
			value={remarks}
			onChange={(e) => setRemarks(e.target.value)}
			errors={getFieldErrors("remarks")}
		    />
		    <CheckboxBasic value={isBackup} onChange={setIsBackup} label={"Is Asset For Backup?"} />

		</div>

		<DialogFooter>
		    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={createAssignmentMutation.isPending}>
			Batal
		    </Button>
		    <Button onClick={handleSubmit} disabled={createAssignmentMutation.isPending}>
			{createAssignmentMutation.isPending ? "Menyimpan..." : "Assign"}
		    </Button>
		</DialogFooter>
	    </DialogContent>
	</Dialog>
    )
}