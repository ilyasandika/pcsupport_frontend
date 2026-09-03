import {useEffect, useState} from "react";
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

import { CalendarDays,  MessageSquare, Phone, User, UserRoundPlus} from "lucide-react";
import {AssetAssignmentRepository} from "@/data/repositories/asset-assignment.repository.ts";
import {EmployeeRepository} from "@/data/repositories/employee.repository.ts";
import type {IEmployee} from "@/types/employee.type.ts";
import {useFormErrors} from "@/hooks/use-errors.ts";
import {useNotificationDialog} from "@/context/NotificationDialogContext.tsx";
import {CheckboxBasic} from "@/components/checkbox-basic.tsx";
import {EntityCombobox} from "@/components/entity-combobox.tsx";
import type {IUser} from "@/types/user.type.ts";
import {useMutation, useQuery} from "@tanstack/react-query";
import {UserRepository} from "@/data/repositories/user.repository.ts";
import {capitalizeWords, getLocalDatetime} from "@/helper/helper.tsx";
import type {ICreateAssetAssignmentPayload} from "@/types/asset-assignment.type.ts";
import type {IErrorResponse} from "@/types/api.type.ts";
import {useAuth} from "@/context/AuthContext.tsx";
import {FieldInputWrapper} from "@/components/field-input-wrapper.tsx";
import { Switch } from "@/components/ui/switch";
import {Label} from "@/components/ui/label.tsx";


interface CreateAssetAssignDialog {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    assetTag: string;
}

export const CreateAssetAssignDialog = ({open, onOpenChange, assetTag}: CreateAssetAssignDialog) => {
    const {showNotification} = useNotificationDialog()
    const {setErrors, getFieldErrors} = useFormErrors()
    const {user} = useAuth()

    const [isBackup, setIsBackup] = useState<boolean>(false)
    const [selectedEmployee, setSelectedEmployee] = useState<IEmployee | null>(null)
    const [selectedEngineer, setSelectedEngineer] = useState<IUser | null>()

    const [userNonEmployeeName, setUserNonEmployeeName] = useState("")
    const [openNonPic, setOpenNonPic] = useState<boolean>(false)
    const [assignedAt, setAssignedAt] = useState(getLocalDatetime())
    const [contact, setContact] = useState<string | undefined>()
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

    useEffect(() => {
	const selectedEng = engineers.find((val) => val.id === user?.sub)
	setSelectedEngineer(selectedEng || null)
    }, [engineers])


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
		onClose: () => window.location.reload(),
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
	    assignedAt: new Date(assignedAt).toISOString(),
	    assignById: selectedEngineer?.id,
	    isBackup,
	    contact : contact || undefined,
	    remarks: remarks || undefined,
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
		    <FieldInputWrapper Icon={User} label={"Employee"} errors={getFieldErrors("picEmployeeNik")}>
			<div className="space-y-2">
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
			    <div className="flex items-center gap-2">
				<Switch id="userNonPic" onCheckedChange={setOpenNonPic} checked={openNonPic}/>
				<Label htmlFor="userNonPic" className="flex items-center gap-1 text-sm">Add Non PIC User?</Label>
			    </div>
			</div>
		    </FieldInputWrapper>

		    {
			openNonPic && (
			    <InputText
				label="User Non PIC"
				id="userNonEmployeeName"
				Icon={UserRoundPlus}
				value={userNonEmployeeName}
				onChange={(e) => setUserNonEmployeeName(e.target.value)}
				errors={getFieldErrors("userNonEmployeeName")}
			    />
			)
		    }

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
			label="Assign Date"
			id="assignedAt"
			Icon={CalendarDays}
			type="datetime-local"
			value={assignedAt}
			onChange={(e) => setAssignedAt(e.target.value)}
			errors={getFieldErrors("assignedAt")}
		    />
		    <InputText
			label="Contact"
			id="contact"
			Icon={Phone}
			value={contact}
			onChange={(e) => setContact(e.target.value)}
			errors={getFieldErrors("contact")}
		    />
		    <InputText
			label="Remarks"
			id="remarks"
			Icon={MessageSquare}
			value={remarks}
			onChange={(e) => setRemarks(e.target.value)}
			errors={getFieldErrors("remarks")}
		    />
		    {
			false && <CheckboxBasic value={isBackup} onChange={setIsBackup} label={"Is Asset For Backup?"} />

		    }
		</div>

		<DialogFooter>
		    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={createAssignmentMutation.isPending}>
			Cancel
		    </Button>
		    <Button onClick={handleSubmit} disabled={createAssignmentMutation.isPending}>
			{createAssignmentMutation.isPending ? "Saving..." : "Assign"}
		    </Button>
		</DialogFooter>
	    </DialogContent>
	</Dialog>
    )
}