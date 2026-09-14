import {type ReactNode} from "react";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog.tsx";
import {
    Dialog, DialogContent, DialogDescription, DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog.tsx";

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
    className?: string,
    type?: "alert" | "dialog";
}

export const DialogContainer = ({
				    icon,
				    triggerRender,
				    title,
				    description,
				    content,
				    onContinue,
				    children,
				    variant = "info",
				    open,
				    setOpen,
				    className,
				    type = "alert" // Default menggunakan alert-dialog
				}: IAlertDialogContainerProps) => {

    // Jika tipenya "dialog", gunakan komponen Dialog biasa
    if (type === "dialog") {
	return (
	    <Dialog open={open} onOpenChange={setOpen}>
		<DialogTrigger asChild>
		    {triggerRender}
		</DialogTrigger>
		<DialogContent className={className}>
		    <DialogHeader>
			<DialogTitle className="flex w-full justify-between items-center">
			    <div className="flex flex-row gap-2 items-center">
				{icon && icon}
				{title}
			    </div>
			</DialogTitle>
			<DialogDescription>{description}</DialogDescription>
		    </DialogHeader>
		    {content && content}
		    {children && children}

		    {onContinue && (
			<DialogFooter>
			    <button
				type="button"
				onClick={() => setOpen?.(false)}
				className="px-4 py-2 text-sm border rounded-md"
			    >
				Cancel
			    </button>
			    <button
				type="button"
				onClick={onContinue}
				className="px-4 py-2 text-sm bg-primary text-white rounded-md"
			    >
				Continue
			    </button>
			</DialogFooter>
		    )}
		</DialogContent>
	    </Dialog>
	);
    }

    return (
	<AlertDialog open={open} onOpenChange={setOpen}>
	    <AlertDialogTrigger asChild>
		{triggerRender}
	    </AlertDialogTrigger>
	    <AlertDialogContent className={className}>
		<AlertDialogHeader>
		    <AlertDialogTitle className="flex w-full justify-between items-center">
			<div className="flex flex-row gap-2 items-center">
			    {icon && icon}
			    {title}
			</div>
			<AlertDialogCancel variant={"link"}>X</AlertDialogCancel>
		    </AlertDialogTitle>
		    <AlertDialogDescription>{description}</AlertDialogDescription>
		</AlertDialogHeader>
		{content && content}
		{children && children}

		{onContinue &&
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction variant={variant == "danger" ? "destructive" : "default"}
                                           onClick={onContinue}>
                            Continue
                        </AlertDialogAction>
                    </AlertDialogFooter>
		}
	    </AlertDialogContent>
	</AlertDialog>
    )
}