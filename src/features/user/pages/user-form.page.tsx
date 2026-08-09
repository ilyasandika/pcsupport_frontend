import {FormWrapper} from "@/components/form-wrapper.tsx";
import {Contact, KeyRound, Mail, MapPin, UserIcon, UserCog} from "lucide-react";
import {InputText} from "@/components/input-text.tsx";
import {useEffect, useState} from "react";
import {UserRepository} from "@/data/repositories/user.repository.ts";
import {useLoaderData, useParams} from "react-router";
import type {IDetailUser} from "@/types/user.type.ts";
import {InputSelect} from "@/components/input-select.tsx";
import type {IWorkLocation} from "@/types/work-location.type.ts";
import {SeparatorWithLabel} from "@/components/separator-with-label.tsx";
import {useFormErrors} from "@/hooks/use-errors.tsx";
import {useNotificationDialog} from "@/context/NotificationDialogContext.tsx";


export const UserFormPage = () => {
    const {showNotification} = useNotificationDialog()
    const {user, workLocations}: {user: IDetailUser, workLocations: IWorkLocation[]} = useLoaderData()
    const {id} = useParams()
    const {setErrors, getFieldErrors} = useFormErrors()


    useEffect(() => {
	console.log(user)
    }, [user]);

    const roleList = [
	{label: "Admin", value: "admin"},
	{label: "Engineer", value: "engineer"},
	{label: "Helpdesk", value: "helpdesk"}
    ]

    const workLocationList = workLocations.map(workLocation => ({
	label: workLocation.name,
	value: workLocation.id as unknown as string
    }))

    const [fullName, setFullName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [username, setUsername] = useState("")
    const [role, setRole] = useState<string>("")
    const [workLocationId, setWorkLocationId] = useState<number>()

    const isUpdate = !!id

    useEffect(() => {
        if (user) {
            setFullName(user.fullName)
            setEmail(user.email)
            setUsername(user.username)
            setRole(user.role)
            setWorkLocationId(user.workLocation.id)
        }
    }, [user])

    const handleSubmit = async () => {
        try {
            if (isUpdate) {
                await UserRepository.updateUser(Number(id), {
                    fullName,
                    email,
                    username,
                    role,
                    workLocationId: Number(workLocationId)
                }).then(() => {
		    showNotification({
			variant: "success",
			title: "User has been updated",
			description: "User has been updated successfully",
			onClose: () => window.location.replace('/users'),
		    })
		}).catch(err => {
		    setErrors(err.errors)
		    return
		})
            } else {
                await UserRepository.createUser({
                    fullName,
                    email,
                    username,
                    password,
                    role,
                    workLocationId: Number(workLocationId)
                })
		    .then(() => {
			showNotification({
			    variant: "success",
			    title: "User has been created",
			    description: "User has been created successfully",
			    onClose: () => window.location.replace('/users'),
			})
		    })
		    .catch(err => {
		    setErrors(err.errors)
		    return
		})
            }
        } catch (error) {
            console.error('Error submitting user:', error)
        }
    }

    return (
	<FormWrapper
	    label={"User"}
	    variant={isUpdate ? "update" : "create"}
	    action={handleSubmit}
	    Icon={UserIcon}
	    errors={getFieldErrors("general")}
	>
	    <div className="flex flex-col gap-4">
		<SeparatorWithLabel label="Personal Information"  first/>
		<div className="grid grid-cols-2 gap-4">

		    <InputText
			label="Full Name"
			id="fullName"
			Icon={UserIcon}
			value={fullName}
			onChange={(e) => setFullName(e.target.value)}
			errors={getFieldErrors("fullName")}
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
		<SeparatorWithLabel label="Credentials" />
		<div className="grid grid-cols-2 gap-4">
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
		<SeparatorWithLabel label="Work Information" />
		<div className="flex flex-row gap-4 ">
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
	    </div>
	</FormWrapper>
    )
}