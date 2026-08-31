import { FormWrapper } from "@/components/form-wrapper.tsx";
import { Contact, KeyRound, Mail, MapPin, UserIcon, UserCog } from "lucide-react";
import { InputText } from "@/components/input-text.tsx";
import { useEffect, useState } from "react";
import { UserRepository } from "@/data/repositories/user.repository.ts";
import { useLoaderData, useParams } from "react-router";
import type { IDetailUser, ICreateUserDTO, IUpdateUserDTO } from "@/types/user.type.ts";
import { InputSelect } from "@/components/input-select.tsx";
import type { IWorkLocation } from "@/types/work-location.type.ts";
import { SeparatorWithLabel } from "@/components/separator-with-label.tsx";
import { useFormErrors } from "@/hooks/use-errors.tsx";
import { useNotificationDialog } from "@/context/NotificationDialogContext.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { useMutation } from "@tanstack/react-query";
import type { IErrorResponse } from "@/types/api.type.ts";


export const UserFormPage = () => {
	const { showNotification } = useNotificationDialog()
	const { user, workLocations }: { user: IDetailUser, workLocations: IWorkLocation[] } = useLoaderData()
	const { id } = useParams()
	const { setErrors, getFieldErrors } = useFormErrors()

	const roleList = [
		{ label: "Admin", value: "admin" },
		{ label: "Engineer", value: "engineer" },
		{ label: "Helpdesk", value: "helpdesk" },
		{ label: "Supervisor", value: "supervisor" },
		{ label: "Display", value: "display" },

	]

	const workLocationList = workLocations.map(workLocation => ({
		label: workLocation.name,
		value: workLocation.id as unknown as string
	}))

	const [fullName, setFullName] = useState("")
	const [nik, setNik] = useState("")
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [username, setUsername] = useState("")
	const [role, setRole] = useState<string>("")
	const [workLocationId, setWorkLocationId] = useState<number>()

	const isUpdate = !!id

	useEffect(() => {
		if (user) {
			setFullName(user.fullName)
			setNik(user.nik || "")
			setEmail(user.email)
			setUsername(user.username)
			setRole(user.role)
			setWorkLocationId(user.workLocation.id)
		}
	}, [user])

	const { mutate, isPending } = useMutation({
		mutationFn: (payload: ICreateUserDTO | IUpdateUserDTO) => {
			return isUpdate
				? UserRepository.updateUser(Number(id), payload as IUpdateUserDTO)
				: UserRepository.createUser(payload as ICreateUserDTO);
		},
		onSuccess: () => {
			const actionText = isUpdate ? "updated" : "created";
			showNotification({
				variant: "success",
				title: `User has been ${actionText}`,
				description: `User has been ${actionText} successfully`,
				onClose: () => window.location.replace('/users'),
			});
		},
		onError: (err: IErrorResponse) => {
			setErrors(err.errors);
		}
	});

	const handleSubmit = () => {
		if (isUpdate) {
			mutate({
				fullName,
				nik,
				email,
				username,
				role,
				workLocationId: Number(workLocationId)
			});
		} else {
			mutate({
				fullName,
				nik,
				email,
				username,
				password,
				role,
				workLocationId: Number(workLocationId)
			});
		}
	}

	return (
		<FormWrapper
			label={"User"}
			description={isUpdate ? "Update user account details" : "Create a new user account"}
			variant={isUpdate ? "update" : "create"}
			action={handleSubmit}
			Icon={UserIcon}
			isLoading={isPending}
			errors={getFieldErrors("general")}
		>
			<div className="space-y-4">
				<Card>
					<CardContent className="flex flex-col gap-4">
						<SeparatorWithLabel label="Personal Information" />
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<InputText
								label="Full Name"
								id="fullName"
								Icon={UserIcon}
								value={fullName}
								onChange={(e) => setFullName(e.target.value)}
								errors={getFieldErrors("fullName")}
							/>
							<InputText
								label="NIK"
								id="nik"
								Icon={Contact}
								value={nik}
								onChange={(e) => setNik(e.target.value)}
								errors={getFieldErrors("nik")}
							/>
							<InputText
								label="Email"
								id="email"
								Icon={Mail}
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								type="email"
								errors={getFieldErrors("email")}
							/>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="flex flex-col gap-4">
						<SeparatorWithLabel label="Credentials" />
						<div className={isUpdate ? "grid grid-cols-1 gap-4" : "grid grid-cols-1 md:grid-cols-2 gap-4"}>
							<InputText
								label="Username"
								id="username"
								Icon={Contact}
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								errors={getFieldErrors("username")}
							/>
							{!isUpdate && (
								<InputText
									label="Password"
									id="password"
									Icon={KeyRound}
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									type="password"
									errors={getFieldErrors("password")}
								/>
							)}
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="flex flex-col gap-4">
						<SeparatorWithLabel label="Work Information" />
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<InputSelect
								value={role}
								items={roleList}
								onChange={value => setRole(value)}
								Icon={UserCog}
								label={"Role"}
								errors={getFieldErrors("role")}
							/>
							<InputSelect
								value={workLocationId as unknown as string}
								items={workLocationList}
								onChange={value => setWorkLocationId(Number(value))}
								Icon={MapPin}
								label={"Work Location"}
								errors={getFieldErrors("workLocationId")}
							/>
						</div>
					</CardContent>
				</Card>
			</div>
		</FormWrapper>
	)
}
