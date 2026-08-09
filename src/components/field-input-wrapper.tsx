import {Field, FieldContent, FieldDescription, FieldLabel} from "@/components/ui/field.tsx";
import type {ReactNode} from "react";
import {Asterisk, type LucideIcon} from "lucide-react";
import {capitalizeWords} from "@/helper/helper.tsx";

export interface IFieldInputWrapper {
    children?: ReactNode
    Icon: LucideIcon,
    label: string,
    errors?: string[],
    required?: boolean,
}


export const FieldInputWrapper = ({children, label, Icon, errors, required = false}: IFieldInputWrapper) => {
    return (
	<Field>
	    <FieldLabel htmlFor={label} className="flex items-center gap-1">
		<div className="flex items-center gap-2">
		    <Icon className="w-4 h-4"/>
		    {label}
		</div>
		{required && <Asterisk className="text-danger w-3 h-3"/>}
	    </FieldLabel>
	    <FieldContent>
		{children}
	    </FieldContent>
	    <FieldDescription>
		{
		    errors?.length && errors.map(value => (
			<p className="text-danger">{capitalizeWords(value, "only first")}</p>
		    ))
		}
	    </FieldDescription>
	</Field>
    )
}