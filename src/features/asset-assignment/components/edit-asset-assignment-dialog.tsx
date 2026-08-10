import { useEffect, useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { InputText } from "@/components/input-text.tsx";
import { CalendarDays, MessageSquare, Phone, User, UserRoundPlus } from "lucide-react";
import { AssetAssignmentRepository } from "@/data/repositories/asset-assignment.repository.ts";
import { EmployeeRepository } from "@/data/repositories/employee.repository.ts";
import type { IEmployee } from "@/types/employee.type.ts";
import { useFormErrors } from "@/hooks/use-errors.tsx";
import { useNotificationDialog } from "@/context/NotificationDialogContext.tsx";
import { EntityCombobox } from "@/components/entity-combobox.tsx";
import type { IUser } from "@/types/user.type.ts";
import { useMutation, useQuery } from "@tanstack/react-query";
import { UserRepository } from "@/data/repositories/user.repository.ts";
import { capitalizeWords, getLocalDatetime } from "@/helper/helper.tsx";
import type { IDetailAssetAssignment, IUpdateAssetAssignmentPayload } from "@/types/asset-assignment.type.ts";
import type { IErrorResponse } from "@/types/api.type.ts";
import { FieldInputWrapper } from "@/components/field-input-wrapper.tsx";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label.tsx";

interface EditAssetAssignmentDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	assignment: IDetailAssetAssignment | null;
	onSuccess?: () => void;
}

export const EditAssetAssignmentDialog = ({
	open,
	onOpenChange,
	assignment,
	onSuccess,
}: EditAssetAssignmentDialogProps) => {
	const { showNotification } = useNotificationDialog();
	const { setErrors, getFieldErrors, clearErrors } = useFormErrors();

	const [selectedEmployee, setSelectedEmployee] = useState<IEmployee | null>(null);
	const [selectedEngineer, setSelectedEngineer] = useState<IUser | null>(null);
	const [userNonEmployeeName, setUserNonEmployeeName] = useState("");
	const [openNonPic, setOpenNonPic] = useState<boolean>(false);
	const [assignedAt, setAssignedAt] = useState("");
	const [returnedAt, setReturnedAt] = useState("");
	const [contact, setContact] = useState<string | undefined>("");
	const [assignRemarks, setAssignRemarks] = useState("");
	const [returnRemarks, setReturnRemarks] = useState("");
	const [isBackup, setIsBackup] = useState<boolean>(false);

	const { data: engineers = [] } = useQuery({
		queryKey: ["engineers"],
		queryFn: UserRepository.getUsers,
		enabled: open,
	});

	const { data: employees = [] } = useQuery({
		queryKey: ["employees"],
		queryFn: EmployeeRepository.getEmployeeListForDropdown,
		enabled: open,
	});

	useEffect(() => {
		if (open && assignment) {
			clearErrors();
			if (assignment.employee) {
				const emp = employees.find((e) => e.nik === assignment.employee.nik) || assignment.employee;
				setSelectedEmployee(emp);
			} else {
				setSelectedEmployee(null);
			}

			if (assignment.assignBy) {
				const eng = engineers.find((u) => u.id === assignment.assignBy.id) || assignment.assignBy;
				setSelectedEngineer(eng);
			} else {
				setSelectedEngineer(null);
			}

			setUserNonEmployeeName(assignment.userNonEmployeeName || "");
			setOpenNonPic(!!assignment.userNonEmployeeName);
			setAssignedAt(assignment.assignedAt ? getLocalDatetime(assignment.assignedAt) : "");
			setReturnedAt(assignment.returnedAt ? getLocalDatetime(assignment.returnedAt) : "");
			setContact(assignment.contact || "");
			setAssignRemarks(assignment.assignRemarks || assignment.remarks || "");
			setReturnRemarks(assignment.returnRemarks || "");
			setIsBackup(assignment.isBackup || false);
			console.log(assignment, employees, engineers)
		}
	}, [open, assignment, employees, engineers]);

	const updateMutation = useMutation({
		mutationFn: ({ id, payload }: { id: number; payload: IUpdateAssetAssignmentPayload }) =>
			AssetAssignmentRepository.update(id, payload),
		onSuccess: () => {
			onOpenChange(false);
			showNotification({
				variant: "success",
				title: "Assignment berhasil diperbarui",
				description: "Data assignment telah berhasil diubah.",
				onClose: () => {
					if (onSuccess) {
						onSuccess();
					} else {
						window.location.reload();
					}
				},
			});
		},
		onError: (err: IErrorResponse) => {
			setErrors(err.errors);
		},
	});

	const handleSubmit = () => {
		if (!assignment) return;
		if (!selectedEmployee) {
			setErrors([
				{
					field: "picEmployeeNik",
					message: ["Please select an employee"],
				},
			]);
			return;
		}

		const payload: IUpdateAssetAssignmentPayload = {
			picEmployeeNik: selectedEmployee.nik,
			userNonEmployeeName: openNonPic ? (userNonEmployeeName.trim() || null) : null,
			assignedAt: assignedAt ? new Date(assignedAt).toISOString() : undefined,
			returnedAt: returnedAt ? new Date(returnedAt).toISOString() : undefined,
			assignById: selectedEngineer?.id,
			contact: contact ? contact.trim() : null,
			assignRemarks: assignRemarks ? assignRemarks.trim() : null,
			returnRemarks: returnRemarks ? returnRemarks.trim() : null,
			remarks: assignRemarks ? assignRemarks.trim() : null,
			isBackup,
		};

		updateMutation.mutate({ id: assignment.id, payload });
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogTrigger />
			<DialogContent className="max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Edit Assignment</DialogTitle>
					<DialogDescription>
						Ubah detail penugasan aset <span className="font-medium">{assignment?.asset?.assetTag || ""}</span>
					</DialogDescription>
				</DialogHeader>

				<div className="flex flex-col gap-4 py-2">
					<FieldInputWrapper Icon={User} label={"Employee PIC"} errors={getFieldErrors("picEmployeeNik")}>
						<div className="space-y-2">
							<EntityCombobox<IEmployee>
								items={employees}
								value={selectedEmployee}
								getKey={(e) => e.nik}
								getLabel={(e) => `${e.nik} | ${e.name}`}
								getSearchValue={(e) => `${e.nik} ${e.name} ${e.department}`}
								getTitle={(e) => e.name}
								getDescription={(e) => `${e.nik} | ${e.department}`}
								onSelect={(employee) => setSelectedEmployee(employee)}
								onClear={() => setSelectedEmployee(null)}
							/>
							<div className="flex items-center gap-2">
								<Switch id="editUserNonPic" onCheckedChange={setOpenNonPic} checked={openNonPic} />
								<Label htmlFor="editUserNonPic" className="flex items-center gap-1 text-sm">
									Add Non PIC User?
								</Label>
							</div>
						</div>
					</FieldInputWrapper>

					{openNonPic && (
						<InputText
							label="User Non PIC"
							id="editUserNonEmployeeName"
							Icon={UserRoundPlus}
							value={userNonEmployeeName}
							onChange={(e) => setUserNonEmployeeName(e.target.value)}
							errors={getFieldErrors("userNonEmployeeName")}
						/>
					)}

					<FieldInputWrapper Icon={User} label={"Engineer (Assign By)"} errors={getFieldErrors("assignById")}>
						<EntityCombobox<IUser>
							items={engineers}
							value={selectedEngineer}
							getKey={(e) => e.id}
							getLabel={(e) => e.fullName}
							getSearchValue={(e) => `${e.fullName} | ${e.role} | ${e.workLocation?.name}`}
							getTitle={(e) => e.fullName}
							getDescription={(e) => `${capitalizeWords(e.role)} | ${e.workLocation?.name}`}
							onSelect={setSelectedEngineer}
							onClear={() => setSelectedEngineer(null)}
						/>
					</FieldInputWrapper>

					<InputText
						label="Tanggal Assign"
						id="editAssignedAt"
						Icon={CalendarDays}
						type="datetime-local"
						value={assignedAt}
						onChange={(e) => setAssignedAt(e.target.value)}
						errors={getFieldErrors("assignedAt")}
					/>

					{assignment?.returnedAt && (
						<InputText
							label="Tanggal Return"
							id="editReturnedAt"
							Icon={CalendarDays}
							type="datetime-local"
							value={returnedAt}
							onChange={(e) => setReturnedAt(e.target.value)}
							errors={getFieldErrors("returnedAt")}
						/>
					)}

					<InputText
						label="Contact"
						id="editContact"
						Icon={Phone}
						value={contact}
						onChange={(e) => setContact(e.target.value)}
						errors={getFieldErrors("contact")}
					/>

					<InputText
						label="Catatan Assign / Remarks"
						id="editAssignRemarks"
						Icon={MessageSquare}
						value={assignRemarks}
						onChange={(e) => setAssignRemarks(e.target.value)}
						errors={getFieldErrors("assignRemarks")}
					/>

					{assignment?.returnedAt && (
						<InputText
							label="Catatan Return / Return Remarks"
							id="editReturnRemarks"
							Icon={MessageSquare}
							value={returnRemarks}
							onChange={(e) => setReturnRemarks(e.target.value)}
							errors={getFieldErrors("returnRemarks")}
						/>
					)}
				</div>

				<DialogFooter>
					<Button variant="outline" onClick={() => onOpenChange(false)} disabled={updateMutation.isPending}>
						Batal
					</Button>
					<Button onClick={handleSubmit} disabled={updateMutation.isPending}>
						{updateMutation.isPending ? "Menyimpan..." : "Simpan Perubahan"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
