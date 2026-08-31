import { FormWrapper } from "@/components/form-wrapper.tsx";
import { Building2, Calendar, Contact, MapPin, Tag, UserCheck, UserCog } from "lucide-react";
import { InputText } from "@/components/input-text.tsx";
import { useEffect, useState } from "react";
import { EmployeeRepository } from "@/data/repositories/employee.repository.ts";
import { useLoaderData, useParams } from "react-router";
import type { IDetailEmployee, ICreateEmployeeDto, IUpdateEmployeeDto } from "@/types/employee.type.ts";
import { InputSelect } from "@/components/input-select.tsx";
import type { IWorkLocation } from "@/types/work-location.type.ts";
import { SeparatorWithLabel } from "@/components/separator-with-label.tsx";
import { useFormErrors } from "@/hooks/use-errors.tsx";
import { useNotificationDialog } from "@/context/NotificationDialogContext.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { useMutation } from "@tanstack/react-query";
import type { IErrorResponse } from "@/types/api.type.ts";

export const EmployeeFormPage = () => {
	const { showNotification } = useNotificationDialog();
	const { employee, workLocations }: { employee: IDetailEmployee | null; workLocations: IWorkLocation[] } = useLoaderData();
	const { id } = useParams();
	const { setErrors, getFieldErrors } = useFormErrors();

	const statusList = [
		{ label: "OFF BA", value: "OFF_BA" },
		{ label: "ON BA", value: "ON_BA" },
		{ label: "Unknown", value: "" },
	];

	const workLocationList = (workLocations || []).map((workLocation) => ({
		label: workLocation.name,
		value: workLocation.id as unknown as string,
	}));

	const [nik, setNik] = useState("");
	const [nik2, setNik2] = useState("");
	const [name, setName] = useState("");
	const [position, setPosition] = useState("");
	const [positionId, setPositionId] = useState("");
	const [fs, setFs] = useState("");
	const [mjl, setMjl] = useState("");
	const [bod, setBod] = useState("");
	const [religion, setReligion] = useState("");
	const [directorate, setDirectorate] = useState("");
	const [division, setDivision] = useState("");
	const [department, setDepartment] = useState("");
	const [workLocationId, setWorkLocationId] = useState<number>();
	const [status, setStatus] = useState<string>("");
	const [retireDate, setRetireDate] = useState("");

	const isUpdate = !!id;

	useEffect(() => {
		if (employee) {
			setNik(employee.nik || "");
			setNik2(employee.nik2 || "");
			setName(employee.name || "");
			setPosition(employee.position || "");
			setPositionId(employee.positionId || "");
			setFs(employee.fs || "");
			setMjl(employee.mjl || "");
			setBod(employee.bod || "");
			setReligion(employee.religion || "");
			setDirectorate(employee.directorate || "");
			setDivision(employee.division || "");
			setDepartment(employee.department || "");
			setWorkLocationId(employee.workLocationId || employee.workLocation?.id);
			setStatus(
				employee.status === "OFF_BA" || employee.status === "ON_BA"
					? employee.status
					: ""
			);
			setRetireDate(employee.retireDate ? String(employee.retireDate).slice(0, 10) : "");
		}
	}, [employee]);

	const { mutate, isPending } = useMutation({
		mutationFn: (payload: ICreateEmployeeDto | IUpdateEmployeeDto) => {
			return isUpdate
				? EmployeeRepository.updateEmployee(id!, payload as IUpdateEmployeeDto)
				: EmployeeRepository.createEmployee(payload as ICreateEmployeeDto);
		},
		onSuccess: () => {
			const actionText = isUpdate ? "updated" : "created";
			showNotification({
				variant: "success",
				title: `Employee has been ${actionText}`,
				description: `Employee ${name} (${nik}) has been ${actionText} successfully`,
				onClose: () => window.location.replace("/employees"),
			});
		},
		onError: (err: IErrorResponse) => {
			setErrors(err.errors);
		},
	});

	const handleSubmit = () => {
		const payload: ICreateEmployeeDto = {
			nik,
			nik2: nik2 || undefined,
			name,
			position: position || undefined,
			positionId: positionId || undefined,
			fs: fs || undefined,
			mjl: mjl || undefined,
			bod: bod || undefined,
			religion: religion || undefined,
			directorate: directorate || undefined,
			division: division || undefined,
			department: department || undefined,
			workLocationId: Number(workLocationId),
			status: status ? status : null,
			retireDate: retireDate || null,
		};

		mutate(payload);
	};

	return (
		<FormWrapper
			label={"Employee"}
			description={isUpdate ? "Update employee details" : "Create a new employee record"}
			variant={isUpdate ? "update" : "create"}
			action={handleSubmit}
			Icon={UserCheck}
			isLoading={isPending}
			errors={getFieldErrors("general")}
		>
			<div className="space-y-4">
				{/* Personal Information */}
				<Card>
					<CardContent className="flex flex-col gap-4">
						<SeparatorWithLabel label="Personal Information" />
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<InputText
								label="NIK"
								id="nik"
								Icon={Contact}
								value={nik}
								onChange={(e) => setNik(e.target.value)}
								disabled={isUpdate}
								errors={getFieldErrors("nik")}
								required={true}
							/>
							<InputText
								label="NIK 2 (Secondary)"
								id="nik2"
								Icon={Contact}
								value={nik2}
								onChange={(e) => setNik2(e.target.value)}
								errors={getFieldErrors("nik2")}
							/>
							<InputText
								label="Full Name"
								id="name"
								Icon={UserCheck}
								value={name}
								onChange={(e) => setName(e.target.value)}
								errors={getFieldErrors("name")}
								required={true}
							/>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<InputText
								label="Religion"
								id="religion"
								Icon={UserCog}
								value={religion}
								placeholder="e.g. ISLAM, KRISTEN..."
								onChange={(e) => setReligion(e.target.value)}
								errors={getFieldErrors("religion")}
							/>
							<InputSelect
								value={workLocationId as unknown as string}
								items={workLocationList}
								onChange={(value) => setWorkLocationId(Number(value))}
								Icon={MapPin}
								label={"Work Location"}
								errors={getFieldErrors("workLocationId")}
								required={true}
							/>
						</div>
					</CardContent>
				</Card>

				{/* Position & Organizational Information */}
				<Card>
					<CardContent className="flex flex-col gap-4">
						<SeparatorWithLabel label="Position & Organization" />
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<InputText
								label="Position"
								id="position"
								Icon={UserCog}
								value={position}
								onChange={(e) => setPosition(e.target.value)}
								errors={getFieldErrors("position")}
							/>
							<InputText
								label="Position ID"
								id="positionId"
								Icon={Tag}
								value={positionId}
								onChange={(e) => setPositionId(e.target.value)}
								errors={getFieldErrors("positionId")}
							/>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<InputText
								label="Directorate"
								id="directorate"
								Icon={Building2}
								value={directorate}
								onChange={(e) => setDirectorate(e.target.value)}
								errors={getFieldErrors("directorate")}
							/>
							<InputText
								label="Division"
								id="division"
								Icon={Building2}
								value={division}
								onChange={(e) => setDivision(e.target.value)}
								errors={getFieldErrors("division")}
							/>
							<InputText
								label="Department"
								id="department"
								Icon={Building2}
								value={department}
								onChange={(e) => setDepartment(e.target.value)}
								errors={getFieldErrors("department")}
							/>
						</div>
					</CardContent>
				</Card>

				{/* Employment Status & Retirement */}
				<Card>
					<CardContent className="flex flex-col gap-4">
						<SeparatorWithLabel label="Status & Retirement" />
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<InputSelect
								value={status}
								items={statusList}
								onChange={(value) => setStatus(value)}
								Icon={UserCog}
								label={"Status"}
								errors={getFieldErrors("status")}
							/>
							<InputText
								label="Retirement Date"
								id="retireDate"
								Icon={Calendar}
								value={retireDate}
								onChange={(e) => setRetireDate(e.target.value)}
								type="date"
								errors={getFieldErrors("retireDate")}
							/>
						</div>
					</CardContent>
				</Card>
			</div>
		</FormWrapper>
	);
};
