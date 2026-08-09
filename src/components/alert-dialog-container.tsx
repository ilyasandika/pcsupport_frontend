import {type ReactNode} from "react";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog.tsx";

export interface IAlertDialogContainerProps {
    triggerRender?: ReactNode,
    title: string,
    description: string,
    content?: ReactNode,
    onContinue?: () => void,
    icon?: ReactNode,
    open?: boolean,
    setOpen?: (open: boolean) => void,
    children?: ReactNode,
    variant?: "success" | "danger" | "warning" | "info",
}

export const AlertDialogContainer = ({icon, triggerRender, title, description, content, onContinue, children, variant = "info", open, setOpen}: IAlertDialogContainerProps ) => {
    return (
	<AlertDialog open={open} onOpenChange={setOpen}>
	    <AlertDialogTrigger>
		 {triggerRender}
	    </AlertDialogTrigger>
	    <AlertDialogContent>
		<AlertDialogHeader>
		    <AlertDialogTitle className="flex w-full justify-between items-center">
			<div className="flex flex-row gap-2 items-center">
			    {
				icon &&
				icon
			    }{title}
			</div>
			<AlertDialogCancel variant={"link"}>X</AlertDialogCancel>
		    </AlertDialogTitle>
		    <AlertDialogDescription>{description}</AlertDialogDescription>
		</AlertDialogHeader>
		{
		    content &&
		    content
		}
		{
		    children && children
		}

		    {onContinue &&
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction variant={variant == "danger" ? "destructive" : "default"} onClick={onContinue}>
				Continue
                            </AlertDialogAction>
			</AlertDialogFooter>
		    }
	    </AlertDialogContent>
	</AlertDialog>
    )
}