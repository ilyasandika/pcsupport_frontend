import {KeyRound} from "lucide-react";
import {InputText} from "@/components/input-text.tsx";
import {useFormErrors} from "@/hooks/use-errors.ts";
import {useState} from "react";
import {AlertDialogContainer} from "@/components/alert-dialog-container.tsx";
import { AlertDialogFooter, AlertDialogCancel} from "@/components/ui/alert-dialog";
import {UserRepository} from "@/data/repositories/user.repository.ts";
import {useNotificationDialog} from "@/context/NotificationDialogContext.tsx";
import { Button } from "@/components/ui/button";


export const ChangePasswordDialogContent = ({id, open = false, setOpen}: {id?: number, open?:boolean, setOpen?: (open: boolean) => void}) => {
    const {setErrors, getFieldErrors} = useFormErrors()
    const {showNotification} = useNotificationDialog()
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const changePassword = async () => {
	if (id) {
	   await UserRepository.changePassword(id, oldPassword, newPassword)
	       .then(()=>{
		   showNotification({
		       variant: "success",
		       title: "User password has been changed",
		       description: "User password has been changed successfully",
		       onClose: () => window.location.reload(),
		   })
	       })
	       .catch((e)=> {
		   setErrors(e.errors)
		   console.error(e.errors)
	       })
	} else {
	    setErrors([{
		field: 'id',
		message: ['id cannot be empty']
	    }])
	}
    }

    return (
	<AlertDialogContainer open={open} title={"Change Password"} setOpen={setOpen} description={""}>
	    <InputText
		label="Old Password"
		id="oldPassword"
		Icon={KeyRound}
		value={oldPassword}
		onChange={(e) => setOldPassword(e.target.value)}
		type="password"
		errors={getFieldErrors("oldPassword")}
	    />
	    <InputText
		label="New Password"
		id="newPassword"
		Icon={KeyRound}
		value={newPassword}
		onChange={(e) => setNewPassword(e.target.value)}
		type="password"
		errors={getFieldErrors("newPassword")}
	    />
	    <AlertDialogFooter>
		<AlertDialogCancel>Cancel</AlertDialogCancel>
		<Button variant="default" onClick={changePassword}>Continue</Button>
	    </AlertDialogFooter>
	</AlertDialogContainer>
    )
}