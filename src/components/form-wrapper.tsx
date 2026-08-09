import {FileIcon, type LucideIcon} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import {Spinner} from "@/components/ui/spinner.tsx";
import {type ReactNode } from "react";
import {Item, ItemHeader, ItemContent, ItemFooter, ItemTitle, ItemDescription} from "@/components/ui/item";

interface IFormWrapperProps {
    label: string;
    description?: string;
    children: ReactNode;
    variant: "create" | "update";
    action: () => void;
    Icon?: LucideIcon;
    errors?: string[];
    isLoading?: boolean;
}

export const FormWrapper = ({isLoading = false, label, description, variant, children, action, Icon = FileIcon, errors} : IFormWrapperProps) => {
    return (
	<Item className="pt-0">
	    <ItemHeader className="p-0 mb-2">
		<div className="p-4 bg-primary flex gap-4 items-center w-full rounded-lg">
		    <div className="bg-white/10 p-2 rounded-lg">
			<Icon className="w-8 h-8 text-white"/>
		    </div>
		    <div>
			<ItemTitle className="text-primary-foreground font-bold text-lg">{variant === "update" ? "Update" : "Create New"} {label}</ItemTitle>
			<ItemDescription className="text-secondary text-sm">{description}</ItemDescription>
		    </div>
		</div>
	    </ItemHeader>
	    <ItemContent className="p-0">
		{errors?.length &&
                    <ItemDescription className="text-danger bg-ptba-primary-red/10 p-4 rounded-lg flex flex-col gap-2 mb-4">
			{
			    errors?.length && errors.map(error => (
				<span className="capitalize">
					{error}
				</span>
			    ))
			}
                    </ItemDescription>}
		{children}
	    </ItemContent>
	    <ItemFooter  className="flex justify-end w-full bg-white p-4 rounded-lg border mt-2">
		<Button variant="outline" onClick={() => window.history.back()} className="mr-2">Cancel</Button>
		<Button variant="default"
			onClick={() => {
			   action()
			}}
			className="cursor-pointer"
			disabled={isLoading}
		>
		    {isLoading && <Spinner data-icon="inline-start"/>}
		    {variant === "update" ? "Update" : "Create"} {label}
		</Button>
	    </ItemFooter>
	</Item>
    )
}