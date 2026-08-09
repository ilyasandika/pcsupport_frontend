import {Field, FieldDescription, FieldError, FieldLabel} from "@/components/ui/field.tsx";
import type {ChangeEvent} from "react";
import {Asterisk, type LucideIcon} from "lucide-react";
import {Textarea} from "@/components/ui/textarea.tsx";
import {capitalizeWords} from "@/helper/helper.tsx";

interface TextareaFieldProps {
    label: string;
    placeholder?: string;
    value: string;
    onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
    description?: string;
    errors?: string[];
    required?: boolean;
    Icon: LucideIcon
    className?: string;
}

export const TextAreaField = ({value, onChange, label, description, placeholder, errors, required = false, Icon, className}: TextareaFieldProps) => {
    return (
	<Field className={className}>
	    <FieldLabel htmlFor={label}>
		<Icon className="w-4 h-4"/>
		<div className="flex items-start gap-0.5">
		    {label}
		    {required && <Asterisk className="text-ptba-primary-red w-3 h-3"/>}
		</div>
	    </FieldLabel>
	    <Textarea id={label} value={value} onChange={onChange} placeholder={placeholder}/>
	    <FieldDescription>{description}</FieldDescription>
	    {
		errors?.length && errors.map((error) => (
		    <FieldError>
			{capitalizeWords(error, "only first")}
		    </FieldError>
		))
	    }
	</Field>
    )
}
